package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.CarPaymentScheduleR2dbcRepository;

import java.time.Instant;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarPaymentScheduleRepositoryAdapter implements CarPaymentScheduleRepositoryPort {

    private final CarPaymentScheduleR2dbcRepository scheduleRepository;

    @Override
    public Mono<Object> findById(UUID uuid) {
        return null;
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
    public Mono<Object> isSchedulePending(UUID uuid) {
        return null;
    }
}
