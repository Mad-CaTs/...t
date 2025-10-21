package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.wallet.api.dtos.SolicitudBankMassiveUpdateDto;
import world.inclub.wallet.api.dtos.SolicitudBankStatusDto;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.api.dtos.SolicitudebankDTO;
import world.inclub.wallet.api.dtos.WalletTransactionResponseDTO;
import world.inclub.wallet.api.dtos.period.PeriodResponse;
import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.api.mapper.UserMapper;
import world.inclub.wallet.application.service.interfaces.IReasonDetailRetiroBankService;
import world.inclub.wallet.application.service.interfaces.IReasonRetiroBankService;
import world.inclub.wallet.application.service.interfaces.ISolicitudeBankService;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.BankStatus;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.StatusReview;
import world.inclub.wallet.bankAccountWithdrawal.application.service.AuditLogService;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;
import world.inclub.wallet.domain.port.ISolicitudeBankPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.repository.ISolicitudeBankRepository;
import world.inclub.wallet.infraestructure.serviceagent.dtos.EmailRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.InfoEmail;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.AccountService;
import world.inclub.wallet.infraestructure.serviceagent.service.NotificationService;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class SolicitudeBankServiceImpl implements ISolicitudeBankService {
    private final ISolicitudeBankPort iSolicitudeBankPort;
    private final AccountService accountService;
    private final NotificationService notificationService;
    private final IReasonDetailRetiroBankService iReasonDetailRetiroBankService;
    private final IReasonRetiroBankService iReasonRetiroBankService;
    private final ISolicitudeBankRepository iISolicitudeBankRepository;
    private final IWalletTransactionService walletTransactionService;
    private final IAdminPanelService iAdminPanelService;
    private final AuditLogService auditLogService;


    @Override
    public Mono<Tuple2<Flux<SolicitudeBankDto>, Integer>> getPenndingAccountBankByIdUser(
            int page, int size, SolicitudeBankFilterDto filtros) {

        Pageable pageable = PageRequest.of(page, size);

        Integer[] bankStatusArray = (filtros != null && filtros.getBankStatusIds() != null && !filtros.getBankStatusIds().isEmpty())
                ? filtros.getBankStatusIds().toArray(new Integer[0])
                : null;

        Mono<List<PeriodResponse>> periodsMono = (filtros != null && filtros.getPeriodIds() != null && !filtros.getPeriodIds().isEmpty())
                ? iAdminPanelService.getPeriodsByIds(filtros.getPeriodIds())
                : Mono.just(Collections.emptyList());

        return periodsMono.flatMap(periods ->
                iSolicitudeBankPort.getPenndingAccountBankByIdUser(bankStatusArray)
                        .collectList()
                        .flatMap(list -> {


                            log.info(" Total solicitudes obtenidas de BD: {}", list.size());
                            log.info(" Parámetros recibidos -> page: {}, size: {}", page, size);

                            Flux<SolicitudeBankDto> processedFlux = Flux.fromIterable(list)
                                    .flatMap(solicitud -> accountService.getIdAccountBank(solicitud.getIdAccountBank().longValue())
                                            .flatMap(response -> this.getObjectSolicitudeBankDto(solicitud, response))
                                            .switchIfEmpty(Mono.just(solicitud))
                                    )
                                    .filter(solicitud -> matchesFilters(solicitud, filtros, periods))
                                    .cache();

                            return processedFlux.collectList()
                                    .map(filteredList -> {
                                        log.info(" Total solicitudes después de filtros: {}", filteredList.size());

                                        filteredList.sort(Comparator.comparing(SolicitudeBankDto::getFechSolicitud,
                                                Comparator.nullsLast(Comparator.reverseOrder())));

                                        int start = page * size;
                                        int end = Math.min(start + size, filteredList.size());


                                        log.info(" Rango devuelto -> start: {}, end: {}", start, end);
                                        List<SolicitudeBankDto> pageContent = (start < filteredList.size())
                                                ? filteredList.subList(start, end)
                                                : Collections.emptyList();

                                        log.info(" Total devueltos en esta página: {}", pageContent.size());

                                        return Tuples.of(Flux.fromIterable(pageContent), filteredList.size());
                                    });
                        })
        );
    }

    private boolean matchesFilters(SolicitudeBankDto solicitud, SolicitudeBankFilterDto filtros, List<PeriodResponse> periods) {
        if (filtros == null) return true;

        String search = filtros.getSearchText();
        boolean matchesSearch = (search == null || search.isBlank()) || (
                String.valueOf(solicitud.getIdsolicitudebank()).contains(search) ||
                        matchesFullName(solicitud, search) ||
                        (solicitud.getNumDocument() != null &&
                                solicitud.getNumDocument().toLowerCase().contains(search.toLowerCase())) ||

                        String.valueOf(solicitud.getMoney()).contains(search) ||

                        (solicitud.getNumberAccount() != null &&
                                solicitud.getNumberAccount().toLowerCase().contains(search.toLowerCase()))
        );
        boolean matchesFecha = validate(filtros.getFechaRegistro(),
                () -> matchesFecha(solicitud, filtros.getFechaRegistro()));

        boolean matchesPeriod = validatePeriod(periods, solicitud);

        boolean matchesBankStatus = (filtros.getBankStatusIds() == null || filtros.getBankStatusIds().isEmpty())
                || filtros.getBankStatusIds().contains(solicitud.getIdBankStatus());

        boolean matchesCurrency = (filtros.getCurrencyIdBank() == null || filtros.getCurrencyIdBank().isEmpty())
                || filtros.getCurrencyIdBank().contains(solicitud.getCurrencyIdBank());

        boolean matchesReviewStatus = (filtros.getReviewStatusId() == null || filtros.getReviewStatusId().isEmpty())
                || filtros.getReviewStatusId().contains(solicitud.getReviewStatusId());

        boolean matchesIdBank = (filtros.getIdBank() == null)
                || (solicitud.getIdBank() != null && solicitud.getIdBank().intValue() == filtros.getIdBank());

        return matchesSearch && matchesFecha && matchesPeriod && matchesBankStatus && matchesCurrency && matchesReviewStatus  && matchesIdBank;
    }

    private boolean matchesFullName(SolicitudeBankDto solicitud, String search) {
        String fullName = (solicitud.getNameHolder() + " " + solicitud.getLastNameHolder()).toLowerCase();
        String[] terms = search.toLowerCase().split("\\s+");
        return Arrays.stream(terms).allMatch(fullName::contains);
    }


    private boolean validate(String value, Supplier<Boolean> condition) {
        return (value == null || value.isBlank()) || condition.get();
    }

    private boolean validatePeriod(List<PeriodResponse> periods, SolicitudeBankDto solicitud) {
        if (periods == null || periods.isEmpty()) return true;
        if (solicitud.getFechSolicitud() == null) return false;
        LocalDate fechaSolicitud = solicitud.getFechSolicitud().toLocalDate();
        return periods.stream().anyMatch(period -> {
            LocalDate start = toLocalDate(period.getInitialDate());
            LocalDate end = toLocalDate(period.getEndDate());
            return (fechaSolicitud.isEqual(start) || fechaSolicitud.isAfter(start)) &&
                    (fechaSolicitud.isEqual(end) || fechaSolicitud.isBefore(end));
        });
    }

    private boolean matchesFecha(SolicitudeBankDto solicitud, String fechaRegistro) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate filtroFecha = LocalDate.parse(fechaRegistro, formatter);
            return solicitud.getFechSolicitud() != null &&
                    solicitud.getFechSolicitud().toLocalDate().equals(filtroFecha);
        } catch (Exception e) {
            return false;
        }
    }

    private LocalDate toLocalDate(List<Integer> arr) {
        if (arr == null || arr.size() < 3) return null;
        return LocalDate.of(arr.get(0), arr.get(1), arr.get(2));
    }


    @Override
    public Mono<Tuple2<Flux<SolicitudeBankDto>, Integer>> getVerificadoAccountBankByIdUser(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);

        return iSolicitudeBankPort.getVerificadoAccountBankByIdUser()
                .collectList()
                .flatMap(list -> {
                    Flux<SolicitudeBankDto> processedFlux = Flux.fromIterable(list)
                            .flatMap(solicitud -> {
                                return accountService.getIdAccountBank(solicitud.getIdAccountBank().longValue())
                                        .flatMap(response -> {
                                            return this.getObjectSolicitudeBankDto(solicitud, response);
                                        })
                                        .switchIfEmpty(Mono.just(solicitud));
                            })

                            .filter(solicitud -> {
                                if (search == null || search.isEmpty()) {
                                    return true;
                                }

                                String searchLower = search.toLowerCase();

                                // Convertir la lista de integers a string para la búsqueda
                                String fechaStr = solicitud.getFechSolicitud() != null ?
                                        solicitud.getFechSolicitud().toString() : "";

                                return String.valueOf(solicitud.getIdsolicitudebank()).contains(searchLower) ||
                                        fechaStr.toLowerCase().contains(searchLower) ||
                                        (solicitud.getNameHolder() + " " + solicitud.getLastNameHolder()).toLowerCase().contains(searchLower) ||
                                        (solicitud.getNumDocument() != null &&
                                                solicitud.getNumDocument().toLowerCase().contains(searchLower)) ||
                                        String.valueOf(solicitud.getMoney()).contains(searchLower) ||
                                        (solicitud.getNumberAccount() != null &&
                                                solicitud.getNumberAccount().toLowerCase().contains(searchLower));
                            })
                            .cache(); // Cacheamos los resultados para no procesarlos dos veces

                    // contar todos los elementos filtrados
                    Mono<Integer> countMono = processedFlux.count().map(Long::intValue);

                    // resultados ya filtrados
                    Flux<SolicitudeBankDto> paginatedFlux = processedFlux
                            .skip((long) pageable.getPageNumber() * pageable.getPageSize())
                            .take(pageable.getPageSize());

                    // Combinamos el flux paginado con el conteo total
                    return countMono.map(count -> Tuples.of(paginatedFlux, count));
                });
    }

    public Solicitudebank entitySaveSolicitudebank(SolicitudebankDTO solicitudebank) {
        ZoneId zoneId = ZoneId.of("America/Lima");
        LocalDateTime dateUtc5 = LocalDateTime.now(zoneId);
        return Solicitudebank.builder()
                .idUser(solicitudebank.getIdUser()).idWallet(null)
                .idCountry(solicitudebank.getIdCountry()).idCurrency(solicitudebank.getIdCurrency())
                .idAccountBank(solicitudebank.getIdAccountBank()).money(solicitudebank.getMoney())
                .fechSolicitud(dateUtc5)
                .status(1)
                .idBankStatus(1)
                .review_status_id(1)
                .fechProcess(null).build();
    }

    private EmailRequestDTO datosEmailRequestSolicitados(SolicitudebankDTO solicitudebank,
                                                         Solicitudebank bank,
                                                         AccountBankResponse response) {
        EmailRequestDTO emailRequestDTO = new EmailRequestDTO();
        emailRequestDTO.setInfoEmail(new InfoEmail());
        emailRequestDTO.getInfoEmail().setTypeTemplate(40);
        emailRequestDTO.getInfoEmail().setOperationNumber(bank.getIdAccountBank().toString());
        emailRequestDTO.getInfoEmail().setAmountPaid(bank.getMoney());
        emailRequestDTO.getInfoEmail().setFechaSolicitud(bank.getFechSolicitud());
        emailRequestDTO.getInfoEmail().setCuentaInterbancaria(response.getCci());
        emailRequestDTO.getInfoEmail().setNameBank(response.getNameBank());

        emailRequestDTO.setUser(new UserResponse());
        emailRequestDTO.getUser().setIdUser(response.getIdUser().intValue());
        emailRequestDTO.getUser().setEmail(response.getEmail());
        emailRequestDTO.getUser().setName(solicitudebank.getNamePropio());
        emailRequestDTO.getUser().setLastName(solicitudebank.getLastnamePropio());
        emailRequestDTO.getUser().setNameDestination(response.getNameHolder() + " " + response.getLastNameHolder());
        return emailRequestDTO;
    }

    @Override
    public Mono<Solicitudebank> saveAccountBank(SolicitudebankDTO solicitudebank) {
        Solicitudebank solicitudebank1 = this.entitySaveSolicitudebank(solicitudebank);
        return iSolicitudeBankPort.saveAccountBank(solicitudebank1).flatMap(
                bank -> {
                    return accountService.getIdAccountBank(bank.getIdAccountBank().longValue())
                            .doOnSuccess(accountBank -> System.out.println("Account Bank: " + accountBank))
                            .flatMap(response -> {

                                WalletTransaction walletTransactionEnvio = this.datosWalletTransaction(solicitudebank1, response);
                                return walletTransactionService.solictudBanTransaction(walletTransactionEnvio, solicitudebank1.getIdUser())
                                        .doOnSuccess(walletTransaction -> System.out.println("walletTransaction: " + walletTransaction))
                                        .flatMap(walletTransaction -> {
                                            EmailRequestDTO emailRequestDTO = this.datosEmailRequestSolicitados(solicitudebank, bank, response);
                                            return notificationService.sendEmail(emailRequestDTO).then(Mono.just(bank));
                                        });
                            });
                });

    }

    private String formatDate(List<Integer> dateParts) {
        if (dateParts == null || dateParts.size() < 3) return "";
        return String.format("%04d-%02d-%02d", dateParts.get(0), dateParts.get(1), dateParts.get(2));
    }

    public Mono<SolicitudeBankDto> getObjectSolicitudeBankDto(SolicitudeBankDto solicitud, AccountBankResponse response) {
        return accountService.getUserAccountById(solicitud.getIdUser()).flatMap(accountResponse -> {
            SolicitudeBankDto solicitudeBankDto = SolicitudeBankDto.builder()
                    .idsolicitudebank(solicitud.getIdsolicitudebank())
                    .idUser(solicitud.getIdUser())
                    .idWallet(solicitud.getIdWallet())
                    .idCountry(solicitud.getIdCountry())
                    .idCurrency(solicitud.getIdCurrency())
                    .idAccountBank(solicitud.getIdAccountBank())
                    .idBankStatus(solicitud.getIdBankStatus())

                    .nameCountry(response.getNameCountry())
                    .bankAddress(response.getBankAddress())
                    .codeSwift(response.getCodeSwift())
                    .codeIban(response.getCodeIban())
                    .numberAccount(response.getNumberAccount())
                    .cci(response.getCci())
                    .idTypeAccountBank(response.getIdTypeAccountBank())
                    .nameTypeAccountBank(response.getNameTypeAccountBank())
                    .nameHolder(response.getNameHolder())
                    .numberContribuyente(response.getNumberContribuyente())
                    .razonSocial(response.getRazonSocial())
                    .addressFiscal(response.getAddressFiscal())
                    .idBank(response.getIdBank())
                    .nameBank(response.getNameBank())
                    .currencyIdBank(response.getCurrencyIdBank())
                    .lastNameHolder(response.getLastNameHolder())
                    .email(response.getEmail())
                    .idDocumentType(response.getIdDocumentType())
                    .numDocument(response.getNumDocument())
                    .titular(response.getTitular())
                    .nameOrigen(accountResponse.getName())
                    .lastNameOrigen(accountResponse.getLastName())
                    .usernameOrigen(accountResponse.getUsername())

                    .money(solicitud.getMoney())
                    .fechSolicitud(solicitud.getFechSolicitud())
                    .status(solicitud.getStatus())
                    .fechProcess(solicitud.getFechProcess())

                    .reviewStatusId(solicitud.getReviewStatusId())
                    .reviewStatusDescription(solicitud.getReviewStatusDescription())
                    .build();
            System.out.println("solicitud actualizada: " + solicitudeBankDto);
            return Mono.just(solicitudeBankDto);
        });
    }

    @Override
    public Mono<Boolean> updateAccountBank(SolicitudBankStatusDto solicitudebank, String username) {
        Integer newStatus = solicitudebank.getStatus();

        return iISolicitudeBankRepository.findById(solicitudebank.getIdsolicitudebank())
                .flatMap(existingSolicitud -> {
                    Integer existingStatus = existingSolicitud.getStatus();
                    Integer idBankStatus = existingSolicitud.getIdBankStatus();

                    log.info("Procesando solicitud {} | existingStatus={} | idBankStatus={} | newStatus={}",
                            existingSolicitud.getIdsolicitudebank(), existingStatus, idBankStatus, newStatus);
                    if (existingStatus == 2 && idBankStatus == 4) {
                        log.info("Solicitud {} ya procesada (status=2, idBankStatus=4), se omite.", existingSolicitud.getIdsolicitudebank());
                        return Mono.just(false);
                    }
                    if (newStatus == 2 && existingStatus == 1 && idBankStatus == 4) {
                        existingSolicitud.setStatus(2);
                        existingSolicitud.setFechProcess(LocalDateTime.now());
                        log.info("Solicitud {} cumple condición para aprobar.", existingSolicitud.getIdsolicitudebank());
                        return this.obtainAccountBankAprove(existingSolicitud, solicitudebank, username);
                    }

                    if (newStatus == 0) {
                        existingSolicitud.setStatus(0);
                        existingSolicitud.setFechProcess(LocalDateTime.now());
                        log.info("Solicitud {} marcada como rechazada desde el front.", existingSolicitud.getIdsolicitudebank());
                        return this.obtainAccountBankRechase(existingSolicitud, solicitudebank, username);
                    }

                    if (newStatus == 2 && !(existingStatus == 1 && idBankStatus == 4)) {
                        log.info("Solicitud {} no cumple regla de aprobación, se rechaza.", existingSolicitud.getIdsolicitudebank());
                        existingSolicitud.setStatus(0);
                        existingSolicitud.setFechProcess(LocalDateTime.now());
                        return this.obtainAccountBankRechase(existingSolicitud, solicitudebank, username);
                    }
                    log.info("Solicitud {} no requiere acción.", existingSolicitud.getIdsolicitudebank());
                    return Mono.just(false);
                })
                .switchIfEmpty(Mono.just(false))
                .onErrorResume(e -> {
                    log.error("Error procesando solicitud bancaria: {}", e.getMessage());
                    return Mono.just(false);
                });
    }

    @Override
    public Mono<Boolean> updateMasivaSolicitudeAccountBankOptimized(SolicitudBankMassiveUpdateDto massiveUpdateDto , String username) {
        if (massiveUpdateDto == null || massiveUpdateDto.getSolicitudes() == null
                || massiveUpdateDto.getSolicitudes().isEmpty()) {
            return Mono.just(false);
        }

        List<SolicitudBankStatusDto> solicitudBankStatusDtos = massiveUpdateDto.getSolicitudes().stream()
                .map(item -> {
                    SolicitudBankStatusDto dto = new SolicitudBankStatusDto();
                    dto.setIdsolicitudebank(item.getIdsolicitudebank());
                    dto.setNamePropio(item.getNamePropio());
                    dto.setLastnamePropio(item.getLastnamePropio());
                    dto.setMsg(massiveUpdateDto.getMsg());
                    dto.setIdReasonRetiroBank(massiveUpdateDto.getIdReasonRetiroBank());
                    dto.setStatus(massiveUpdateDto.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());

        List<Long> solicitudIds = massiveUpdateDto.getSolicitudes().stream()
                .map(item -> item.getIdsolicitudebank())
                .collect(Collectors.toList());

        return updateMasivaSolicitudeAccountBank(solicitudBankStatusDtos,username)
                .flatMap(success -> {
                    if (success) {
                        return updateReviewStatusMassive(solicitudIds)
                                .then(Mono.just(true));
                    } else {
                        return Mono.just(false);
                    }
                });
    }

    @Override
    public Mono<Boolean> updateMasivaSolicitudeAccountBank(List<SolicitudBankStatusDto> solicitudBankStatusDto, String username) {
        if (solicitudBankStatusDto == null || solicitudBankStatusDto.isEmpty()) {
            return Mono.just(false);
        }

        final int parallelism = Math.min(4, solicitudBankStatusDto.size());

        List<Long> solicitudIds = solicitudBankStatusDto.stream()
                .map(SolicitudBankStatusDto::getIdsolicitudebank)
                .collect(Collectors.toList());

        return Flux.fromIterable(solicitudBankStatusDto)
                .parallel(parallelism)
                .runOn(Schedulers.boundedElastic())
                .flatMap(solicitudebank -> {
                    if (solicitudebank == null) {
                        return Mono.just(false);
                    }

                    Integer newStatus = solicitudebank.getStatus(); 
                    Long idSolicitud = solicitudebank.getIdsolicitudebank();

                    return iISolicitudeBankRepository.findById(idSolicitud)
                            .flatMap(existingSolicitud -> {
                                Integer existingStatus = existingSolicitud.getStatus();
                                Integer idBankStatus = existingSolicitud.getIdBankStatus(); 

                                log.info("Procesando solicitud masiva {} | existingStatus={} | idBankStatus={} | newStatus={}",
                                        idSolicitud, existingStatus, idBankStatus, newStatus);
                                if (existingStatus == 2 && idBankStatus == 4) {
                                    log.info("Solicitud {} ya procesada (status=2, idBankStatus=4), se omite.", idSolicitud);
                                    return Mono.just(false);
                                }

                                if (newStatus == 2 && existingStatus == 1 && idBankStatus == 4) {
                                    existingSolicitud.setStatus(2);
                                    existingSolicitud.setFechProcess(LocalDateTime.now());
                                    log.info("Solicitud {} cumple condición para aprobar.", idSolicitud);
                                    return this.obtainAccountBankAprove(existingSolicitud, solicitudebank, username);
                                }

                                if (newStatus == 0) {
                                    existingSolicitud.setStatus(0);
                                    existingSolicitud.setFechProcess(LocalDateTime.now());
                                    log.info("Solicitud {} marcada como rechazada desde front.", idSolicitud);
                                    return this.obtainAccountBankRechase(existingSolicitud, solicitudebank, username);
                                }

                                if (newStatus == 2 && !(existingStatus == 1 && idBankStatus == 4)) {
                                    existingSolicitud.setStatus(0);
                                    existingSolicitud.setFechProcess(LocalDateTime.now());
                                    log.info("Solicitud {} no cumple regla de aprobación, pasa a rechazado.", idSolicitud);
                                    return this.obtainAccountBankRechase(existingSolicitud, solicitudebank, username);
                                }
                                log.info("Solicitud {} no requiere acción, se omite.", idSolicitud);
                                return Mono.just(false);
                            })
                            .switchIfEmpty(Mono.just(false))
                            .onErrorReturn(false);

                })
                .sequential()
                .any(Boolean::booleanValue)
                .flatMap(success -> {
                    if (success) {
                        return updateReviewStatusMassive(solicitudIds)
                                .then(Mono.just(true));
                    } else {
                        return Mono.just(false);
                    }
                });
    }

    private Mono<Void> updateReviewStatusMassive(List<Long> solicitudIds) {
        if (solicitudIds == null || solicitudIds.isEmpty()) {
            return Mono.empty();
        }

        return Flux.fromIterable(solicitudIds)
                .flatMap(this::updateReviewStatusByNotificationMasives)
                .then()
                .doOnSuccess(v -> log.info("Status actualizado para {} solicitudes", solicitudIds.size()))
                .doOnError(error -> log.error("Error actualizando review status masivo: {}", error.getMessage()));
    }

    //All method account bank aprobado
    public Mono<Boolean> obtainAccountBankAprove(Solicitudebank existingSolicitud,
                                                 SolicitudBankStatusDto solicitudebank ,String Username) {
        Integer idAccountBank = existingSolicitud.getIdAccountBank();

        return accountService.getIdAccountBank(idAccountBank.longValue())
                .doOnSuccess(accountBank -> System.out.println("Account Bank Aprobado: " + accountBank))
                .flatMap(response -> {
                    WalletTransaction walletTransactionEnvio = this.datosWalletTransaction(existingSolicitud, response);
                    EmailRequestDTO emailRequestDTO = this.datosEmailRequestAprobado(existingSolicitud, response, solicitudebank);

                    return walletTransactionService.aprobacionBanTransaction(walletTransactionEnvio, existingSolicitud.getIdUser())
                            .doOnSuccess(walletTransaction -> System.out.println("walletTransaction: " + walletTransaction))
                            .flatMap(walletTransaction -> {
                                Integer idWallet = walletTransaction.getIdWallet().intValue();
                                existingSolicitud.setIdWallet(idWallet);
                                return iSolicitudeBankPort.updateAccountBank(existingSolicitud)
                                        // .then(Mono.just(true))
                                        //.onErrorReturn(false);
                                        .flatMap(
                                                updateEntity -> notificationService.sendEmail(emailRequestDTO)
                                                        .then(
                                                                // Guardar audit log de tipo 1
                                                                auditLogService.saveType1(Username, Math.toIntExact(existingSolicitud.getIdsolicitudebank()), null, StatusReview.NOTIFIED.getCode())
                                                        )
                                                        .thenReturn(true)
                                                        .onErrorReturn(false)
                                        );
                            })
                            .onErrorReturn(false);
                }).switchIfEmpty(Mono.just(false));
    }

    public WalletTransaction datosWalletTransaction(Solicitudebank existingSolicitud, AccountBankResponse response) {
        BigDecimal money = existingSolicitud.getMoney();
        String descripcion = "Retiro a cuenta bancaria a " + " " + response.getNameBank();
        int idEnvioTransfer = CodeTypeWalletTransaction.RETIRO.getValue();
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setIdTypeWalletTransaction(idEnvioTransfer);
        walletTransaction.setAmount(money);
        walletTransaction.setReferenceData(descripcion);
        walletTransaction.setIsAvailable(true);
        walletTransaction.setIsSucessfulTransaction(true);

        return walletTransaction;
        //return new WalletTransaction(idEnvioTransfer, money,
        //       descripcion,true);
    }

    public WalletTransaction datosWalletTransactionRechaso(Solicitudebank existingSolicitud, AccountBankResponse response) {
        BigDecimal money = existingSolicitud.getMoney();
        String descripcion = "Retiro a cuenta bancaria a " + " " + response.getNameBank();
        int idEnvioTransfer = CodeTypeWalletTransaction.RECARGA_WALLET.getValue();
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setIdTypeWalletTransaction(idEnvioTransfer);
        walletTransaction.setAmount(money);
        walletTransaction.setReferenceData(descripcion);
        walletTransaction.setIsAvailable(true);
        walletTransaction.setIsSucessfulTransaction(true);

        return walletTransaction;
        //return new WalletTransaction(idEnvioTransfer, money,
        //       descripcion,true);
    }

    private EmailRequestDTO datosEmailRequestAprobado(Solicitudebank existingSolicitud,
                                                      AccountBankResponse response,
                                                      SolicitudBankStatusDto solicitudebank) {
        EmailRequestDTO emailRequest = new EmailRequestDTO();
        // Configuración de InfoEmail
        InfoEmail infoEmail = new InfoEmail();
        infoEmail.setTypeTemplate(42);
        infoEmail.setOperationNumber(response.getIdAccountBank().toString());
        infoEmail.setAmountPaid(existingSolicitud.getMoney());
        infoEmail.setFechaSolicitud(existingSolicitud.getFechSolicitud());
        infoEmail.setCuentaInterbancaria(response.getCci());
        infoEmail.setNameBank(response.getNameBank());
        emailRequest.setInfoEmail(infoEmail);

        // Configuración de UserResponse
        UserResponse user = new UserResponse();
        user.setIdUser(response.getIdUser().intValue());
        user.setEmail(response.getEmail());
        user.setName(solicitudebank.getNamePropio());
        user.setLastName(solicitudebank.getLastnamePropio());
        user.setNameDestination(response.getNameHolder() + " " + response.getLastNameHolder());
        emailRequest.setUser(user);
        return emailRequest;
    }

    //All method account bank recahase
    public Mono<Boolean> obtainAccountBankRechase(Solicitudebank existingSolicitud,
                                                  SolicitudBankStatusDto solicitudebank ,String username) {
        Integer idUser = existingSolicitud.getIdUser();
        Integer idAccountBank = existingSolicitud.getIdAccountBank();

        return accountService.getIdAccountBank(idAccountBank.longValue())
                .doOnSuccess(accountBank -> System.out.println("Account Bank: " + accountBank))
                .flatMap(response -> {

                    existingSolicitud.setIdBankStatus(BankStatus.RECHAZADO.getId());

                    ReasonDetailRetiroBank reasonDetailRetiroBank = this.datosReassonDetail(idUser, solicitudebank);
                    Mono<EmailRequestDTO> emailRequestDTO = this.datosEmailRequestDto(solicitudebank, existingSolicitud, response);
                    WalletTransaction walletTransactionEnvio = this.datosWalletTransactionRechaso(existingSolicitud, response);

                    return iSolicitudeBankPort.updateAccountBank(existingSolicitud).flatMap(save -> {
                        return iReasonDetailRetiroBankService.saveReasonDetailRetiroBank(reasonDetailRetiroBank)
                                .flatMap(updateEntity -> {
                                            //WalletTransaction walletTransactionEnvio = this.datosWalletTransactionRechaso(existingSolicitud, response);
                                            return walletTransactionService.rechasoBanTransaction(walletTransactionEnvio, existingSolicitud.getIdUser())
                                                    .doOnSuccess(walletTransaction -> System.out.println("walletTransaction: " + walletTransaction))
                                                    .flatMap(walletTransaction -> emailRequestDTO
                                                            .flatMap(notificationService::sendEmail)
                                                            .then(
                                                                    // Guardar audit log de tipo 1
                                                                    auditLogService.saveType1(
                                                                            username,
                                                                            Math.toIntExact(existingSolicitud.getIdsolicitudebank()),
                                                                            null,
                                                                            StatusReview.NOTIFIED.getCode()
                                                                    )
                                                            )
                                                            .thenReturn(true)
                                                            .onErrorReturn(false)
                                                    );
                                        })
                                .onErrorReturn(false);
                    }).onErrorReturn(false);
                }).switchIfEmpty(Mono.just(false)).onErrorReturn(false);

    }

    public ReasonDetailRetiroBank datosReassonDetail(Integer idUser,
                                                     SolicitudBankStatusDto solicitudebank) {
        return new ReasonDetailRetiroBank(null,
                solicitudebank.getIdReasonRetiroBank(),
                idUser,
                solicitudebank.getMsg());
    }

    private Mono<EmailRequestDTO> datosEmailRequestDto(SolicitudBankStatusDto solicitudebank,
                                                       Solicitudebank solicitudebankEntity,
                                                       AccountBankResponse response) {
        return iReasonRetiroBankService
                .getIdReasonRetiroBank(solicitudebank.getIdReasonRetiroBank().longValue()).map(reasonDetailRetiroBank -> {
                    EmailRequestDTO emailRequest = new EmailRequestDTO();
                    // Configuración de InfoEmail
                    InfoEmail infoEmail = new InfoEmail();
                    infoEmail.setTypeTemplate(41);
                    infoEmail.setMotivo(reasonDetailRetiroBank.getTitle());
                    infoEmail.setMsg(solicitudebank.getMsg());
                    infoEmail.setFechaSolicitud(solicitudebankEntity.getFechProcess());
                    emailRequest.setInfoEmail(infoEmail);

                    // Configuración de UserResponse
                    UserResponse user = new UserResponse();
                    user.setEmail(response.getEmail());
                    user.setNameDestination(response.getNameHolder() + " " + response.getLastNameHolder());
                    emailRequest.setUser(user);

                    return emailRequest;
                });
    }


    @Override
    public Mono<Void> updateReviewStatus(Long idsolicitudebank,String username) {
        return iSolicitudeBankPort.findById(idsolicitudebank)
                .flatMap(existingSolicitud -> {
                    existingSolicitud.setReview_status_id(StatusReview.VIEWED.getCode());
                    existingSolicitud.setReviewDateUpdate(LocalDateTime.now());
                    return iSolicitudeBankPort.updateAccountBank(existingSolicitud)
                            .thenReturn(existingSolicitud);
                })
                .flatMap(solicitud ->
                        auditLogService.saveType1(username, solicitud.getIdsolicitudebank().intValue(), null, StatusReview.VIEWED.getCode())
                )
                .then();
    }

    @Override
    public Mono<Void> updateReviewStatusByNotificationMasives(Long idsolicitudebank) {
        return iSolicitudeBankPort.findById(idsolicitudebank)
                .flatMap(existingSolicitud -> {
                    existingSolicitud.setReview_status_id(StatusReview.NOTIFIED.getCode());
                    existingSolicitud.setReviewDateUpdate(LocalDateTime.now());
                    return iSolicitudeBankPort.updateAccountBank(existingSolicitud);
                })
                .then();
    }

    @Override
    public Mono<Boolean> updateBankStatusOnly(List<Long> solicitudIds, Integer newBankStatus) {
        if (solicitudIds == null || solicitudIds.isEmpty() || newBankStatus == null) {
            log.warn("updateBankStatusOnly: parámetros inválidos");
            return Mono.just(false);
        }

        log.info("Actualizando idBankStatus a {} para {} solicitudes: {}",
                newBankStatus, solicitudIds.size(), solicitudIds);

        return Flux.fromIterable(solicitudIds)
                .flatMap(id -> iSolicitudeBankPort.updateBankStatus(id, newBankStatus)
                        .doOnSuccess(v -> log.debug("Actualizado ID: {} a estado: {}", id, newBankStatus))
                        .thenReturn(true)
                        .onErrorResume(e -> {
                            log.error("Error actualizando ID {}: {}", id, e.getMessage());
                            return Mono.just(false);
                        }))
                .reduce((a, b) -> a && b)
                .defaultIfEmpty(false)
                .doOnSuccess(result -> {
                    if (result) {
                        log.info("✓ Todos los estados actualizados exitosamente");
                    } else {
                        log.error("✗ Algunos estados no se actualizaron");
                    }
                });
    }
}
