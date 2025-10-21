package world.inclub.wallet.bankAccountWithdrawal.infrastructure.adapter;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.period.PeriodResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AuditLogDTO;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.PagedResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.UserAdminDTO;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.AuditLogEntity;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.AuditLogRepositoryPort;
import world.inclub.wallet.bankAccountWithdrawal.domain.repository.AuditLogR2dbcRepository;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.AuditLogFilter;
import world.inclub.wallet.infraestructure.serviceagent.service.AdminPanelServiceImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Repository
public class AuditLogRepositoryAdapter implements AuditLogRepositoryPort {

    private final AuditLogR2dbcRepository r2dbcRepository;
    private final AdminPanelServiceImpl adminPanelService;


    @Override
    public Flux<AuditLogDTO> findByType(Integer type) {
        return r2dbcRepository.findByType(type)
                .flatMap(entity -> {
                    AuditLogDTO log = new AuditLogDTO();
                    log.setId(entity.getId());
                    log.setCreateDate(entity.getCreateDate());
                    log.setUserAdminId(entity.getUserAdminId());
                    log.setRole(entity.getRole());
                    log.setType(entity.getType());
                    log.setIdSolicitudBank(entity.getIdSolicitudBank());
                    log.setFileName(entity.getFileName());
                    log.setRecordsCount(entity.getRecordsCount());
                    log.setSize(entity.getSize());
                    log.setActionId(entity.getActionId());
                    return adminPanelService.getUserById(Math.toIntExact(entity.getUserAdminId()))
                            .map(user -> {
                                log.setUserName(user.getUserName());
                                log.setName(user.getName());
                                log.setLastName(user.getLastName());
                                return log;
                            })
                            .defaultIfEmpty(log);
                });
    }

    @Override
    public Mono<Void> saveAuditLog(AuditLogDTO dto) {
        return adminPanelService.getUserByUsername(dto.getUserName())
                .flatMap(user -> {
                    AuditLogEntity entity = new AuditLogEntity();
                    entity.setUserAdminId(user.getIdUserAdmin());
                    entity.setRole(user.getRolName());
                    entity.setType(dto.getType());
                    entity.setIdSolicitudBank(dto.getIdSolicitudBank() != null ? dto.getIdSolicitudBank().longValue() : null);
                    entity.setFileName(dto.getFileName());
                    entity.setActionId(dto.getActionId() != null ? dto.getActionId().longValue() : null);
                    entity.setCreateDate(LocalDateTime.now());
                    if (dto.getType() == 2) {
                        entity.setRecordsCount(dto.getRecordsCount());
                        entity.setSize(dto.getSize());
                    }

                    return r2dbcRepository.save(entity);
                })
                .then();
    }

    @Override
    public Mono<PagedResponse<AuditLogDTO>> findWithFilters(AuditLogFilter filter) {
        int limit = filter.getSize();
        int offset = filter.getPage() * limit;

        LocalDateTime createDate = filter.getCreateDate();
        Long actionId = filter.getActionId();

        Mono<List<PeriodResponse>> periodsMono = (filter.getPeriodId() != null && !filter.getPeriodId().isEmpty())
                ? adminPanelService.getPeriodsByIds(filter.getPeriodId())
                : Mono.just(Collections.emptyList());
        Mono<List<AuditLogEntity>> entitiesMono = r2dbcRepository.findWithFilters(
                filter.getType(),
                createDate,
                actionId,
                offset,
                limit
        ).collectList();

        Mono<Long> countMono = r2dbcRepository.countWithFilters(
                filter.getType(),
                createDate,
                actionId
        );

        return Mono.zip(entitiesMono, countMono, periodsMono)
                .flatMap(tuple -> {
                    List<AuditLogEntity> entities = tuple.getT1();
                    long totalElements = tuple.getT2();
                    List<PeriodResponse> periods = tuple.getT3();

                    System.out.println("DEBUG: ENTITIES FROM DB: " + entities.size());
                    System.out.println("DEBUG: TOTAL ELEMENTS: " + totalElements);
                    System.out.println("DEBUG: PERIODS FROM ADMIN PANEL: " + periods);

                    if (entities.isEmpty()) {
                        return Mono.just(new PagedResponse<>(
                                List.of(),
                                totalElements,
                                computeTotalPages(totalElements, limit),
                                filter.getPage(),
                                limit
                        ));
                    }

                    List<Integer> userIds = entities.stream()
                            .map(e -> e.getUserAdminId() == null ? null : e.getUserAdminId().intValue())
                            .filter(Objects::nonNull)
                            .distinct()
                            .collect(Collectors.toList());

                    return adminPanelService.getUsersByIds(userIds)
                            .map(usersMap -> {
                                List<AuditLogDTO> dtos = entities.stream()
                                        .map(entity -> {
                                            AuditLogDTO dto = mapEntityToDto(entity);
                                            Integer uid = entity.getUserAdminId() == null ? null : entity.getUserAdminId().intValue();
                                            UserAdminDTO u = uid == null ? null : usersMap.get(uid);
                                            if (u != null) {
                                                dto.setUserName(u.getUserName());
                                                dto.setName(u.getName());
                                                dto.setLastName(u.getLastName());
                                            }
                                            return dto;
                                        })
                                        .peek(dto -> System.out.println("DEBUG: DTO BEFORE FILTER: " + dto.getId() + " -> " + dto.getCreateDate()))
                                        .filter(dto -> applySearchFilter(dto, filter.getSearch())
                                                && validatePeriod(periods, dto, filter.getPeriodId()))
                                        .peek(dto -> System.out.println("DEBUG: DTO AFTER FILTER: " + dto.getId()))
                                        .collect(Collectors.toList());

                                return new PagedResponse<>(
                                        dtos,
                                        totalElements,
                                        computeTotalPages(totalElements, limit),
                                        filter.getPage(),
                                        limit
                                );
                            });
                });
    }

    private boolean applySearchFilter(AuditLogDTO dto, String search) {
        if (search == null || search.isBlank()) return true;
        String s = search.toLowerCase();
        return (dto.getUserName() != null && dto.getUserName().toLowerCase().contains(s))
                || (dto.getName() != null && dto.getName().toLowerCase().contains(s))
                || (dto.getLastName() != null && dto.getLastName().toLowerCase().contains(s));
    }

    private boolean validatePeriod(List<PeriodResponse> periods, AuditLogDTO dto, List<Integer> filterPeriodIds) {
        if (periods == null || periods.isEmpty()) return true;
        if (dto.getCreateDate() == null) return false;

        LocalDate fechaRegistro = dto.getCreateDate().toLocalDate();
        System.out.println("DEBUG: VALIDATING DTO " + dto.getId() + " FECHA: " + fechaRegistro);

        return periods.stream()
                .filter(p -> filterPeriodIds == null || filterPeriodIds.isEmpty() || filterPeriodIds.contains(p.getId()))
                .peek(p -> System.out.println("DEBUG: CHECK PERIOD " + p.getId() + " [" + toLocalDate(p.getInitialDate()) + " - " + toLocalDate(p.getEndDate()) + "]"))
                .anyMatch(period -> {
                    LocalDate start = toLocalDate(period.getInitialDate());
                    LocalDate end = toLocalDate(period.getEndDate());
                    if (start == null || end == null) {
                        System.out.println("DEBUG: PERIOD NULL DATES " + period.getId());
                        return false;
                    }
                    boolean inside = !fechaRegistro.isBefore(start) && !fechaRegistro.isAfter(end);
                    System.out.println("DEBUG: DTO " + dto.getId() + " INSIDE PERIOD " + period.getId() + "? " + inside);
                    return inside;
                });
    }

    private LocalDate toLocalDate(List<Integer> arr) {
        if (arr == null || arr.size() < 3) return null;
        return LocalDate.of(arr.get(0), arr.get(1), arr.get(2));
    }
    private int computeTotalPages(long totalElements, int size) {
        if (size <= 0) return 0;
        return (int) Math.ceil((double) totalElements / size);
    }

    private AuditLogDTO mapEntityToDto(AuditLogEntity entity) {
        return AuditLogDTO.builder()
                .id(entity.getId())
                .createDate(entity.getCreateDate())
                .userAdminId(entity.getUserAdminId())
                .role(entity.getRole())
                .type(entity.getType())
                .idSolicitudBank(entity.getIdSolicitudBank())
                .fileName(entity.getFileName())
                .recordsCount(entity.getRecordsCount())
                .size(entity.getSize())
                .actionId(entity.getActionId())
                .build();
    }
}