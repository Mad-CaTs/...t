package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.CarPaymentSchedule;

import java.time.Instant;
import java.util.UUID;

public interface CarPaymentScheduleRepositoryPort {

    Mono<CarPaymentSchedule> findById(UUID uuid);

    Mono<Void> updateSchedulePayment(UUID scheduleId, Integer statusId, Instant paymentDate);

    Mono<Boolean> existsById(UUID scheduleId);

    Mono<Boolean> isSchedulePending(UUID uuid);
}
