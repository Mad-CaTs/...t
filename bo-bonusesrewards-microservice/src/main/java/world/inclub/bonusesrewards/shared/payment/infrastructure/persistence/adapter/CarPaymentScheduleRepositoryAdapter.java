package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.payment.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.CarPaymentScheduleEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.CarPaymentScheduleR2dbcRepository;

import java.time.Instant;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarPaymentScheduleRepositoryAdapter implements CarPaymentScheduleRepositoryPort {

    private final CarPaymentScheduleR2dbcRepository scheduleRepository;
    private final CarPaymentScheduleEntityMapper scheduleMapper;

    @Override
    public Mono<CarPaymentSchedule> findById(UUID uuid) {
        return scheduleRepository.findById(uuid)
                .map(scheduleMapper::toDomain);
    }

    @Override
    public Mono<Void> updateSchedulePayment(UUID scheduleId, Integer statusId, Instant paymentDate) {
        return scheduleRepository.updateSchedulePayment(scheduleId, statusId, paymentDate)
                .then();
    }

    @Override
    public Mono<Boolean> existsById(UUID scheduleId) {
        return scheduleRepository.existsById(scheduleId);
    }

    @Override
    public Mono<Boolean> isSchedulePending(UUID uuid) {
        return scheduleRepository.findById(uuid)
                .map(entity -> entity.getStatusId() != null && entity.getStatusId() == 2L)
                .defaultIfEmpty(false);
    }
}