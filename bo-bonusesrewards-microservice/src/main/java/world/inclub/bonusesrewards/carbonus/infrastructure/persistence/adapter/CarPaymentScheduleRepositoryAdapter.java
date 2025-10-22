package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarPaymentScheduleEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarPaymentScheduleMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarPaymentScheduleR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Repository
@RequiredArgsConstructor
public class CarPaymentScheduleRepositoryAdapter
        implements CarPaymentScheduleRepositoryPort {

    private final CarPaymentScheduleR2dbcRepository carPaymentScheduleR2dbcRepository;
    private final CarPaymentScheduleMapper carPaymentScheduleMapper;

    @Override
    public Flux<CarPaymentSchedule> saveAll(Iterable<CarPaymentSchedule> schedules) {
        Iterable<CarPaymentScheduleEntity> entities = StreamSupport.stream(schedules.spliterator(), false)
                .map(carPaymentScheduleMapper::toEntity)
                .toList();
        return carPaymentScheduleR2dbcRepository.saveAll(entities)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Mono<CarPaymentSchedule> save(CarPaymentSchedule schedule) {
        return carPaymentScheduleR2dbcRepository
                .save(carPaymentScheduleMapper.toEntity(schedule))
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Flux<CarPaymentSchedule> findOverdueInitials(Long statusId, LocalDate today) {
        return carPaymentScheduleR2dbcRepository.findByIsInitialTrueAndStatusIdAndDueDateLessThan(statusId, today)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Flux<CarPaymentSchedule> findDueOrOverdueMonthlies(Long statusId, LocalDate today) {
        return carPaymentScheduleR2dbcRepository.findByIsInitialFalseAndStatusIdAndDueDateLessThanEqual(statusId, today)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Mono<CarPaymentSchedule> findLastByCarAssignmentId(UUID carAssignmentId) {
        return carPaymentScheduleR2dbcRepository.findFirstByCarAssignmentIdOrderByOrderNumDesc(carAssignmentId)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Flux<CarPaymentSchedule> findByCarAssignmentId(UUID carAssignmentId) {
        return carPaymentScheduleR2dbcRepository.findByCarAssignmentId(carAssignmentId)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Flux<CarPaymentSchedule> findAllByCarAssignmentIdWithPagination(UUID carAssignmentId, Pageable pageable) {
        return carPaymentScheduleR2dbcRepository
                .findAllByCarAssignmentIdWithPagination(
                        carAssignmentId,
                        pageable.limit(),
                        pageable.offset()
                )
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Mono<Long> countByCarAssignmentId(UUID carAssignmentId) {
        return carPaymentScheduleR2dbcRepository.countByCarAssignmentId(carAssignmentId);
    }

    @Override
    public Flux<CarPaymentSchedule> findInitialsByCarAssignmentId(UUID carAssignmentId, Pageable pageable) {
        return carPaymentScheduleR2dbcRepository
                .findInitialsByCarAssignmentId(
                        carAssignmentId,
                        pageable.limit(),
                        pageable.offset()
                )
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Mono<Long> countInitialsByCarAssignmentId(UUID carAssignmentId) {
        return carPaymentScheduleR2dbcRepository.countInitialsByCarAssignmentId(carAssignmentId);
    }

    @Override
    public Mono<CarPaymentSchedule> findById(UUID uuid) {
        return carPaymentScheduleR2dbcRepository.findById(uuid)
                .map(carPaymentScheduleMapper::toDomain);
    }

    @Override
    public Mono<Void> updateSchedulePayment(UUID scheduleId, Integer statusId, LocalDateTime paymentDate) {
        return carPaymentScheduleR2dbcRepository.updateSchedulePayment(scheduleId, statusId, paymentDate)
                .then();
    }

    @Override
    public Mono<Boolean> existsById(UUID scheduleId) {
        return carPaymentScheduleR2dbcRepository.existsById(scheduleId);
    }

    @Override
    public Mono<Boolean> isSchedulePending(UUID uuid) {
        return carPaymentScheduleR2dbcRepository.findById(uuid)
                .map(entity -> entity.getStatusId() != null && entity.getStatusId() == 2L)
                .defaultIfEmpty(false);
    }

    @Override
    public Mono<Long> getMemberIdByScheduleId(UUID scheduleId) {
        return carPaymentScheduleR2dbcRepository.getMemberIdByScheduleId(scheduleId);
    }
}
