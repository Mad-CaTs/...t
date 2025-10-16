package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

public interface CarPaymentScheduleRepositoryPort {

    Mono<Object> findById(UUID uuid);

    Mono<Void> updateSchedulePayment(UUID scheduleId, Integer statusId, Instant paymentDate);

    Mono<Boolean> existsById(UUID scheduleId);

    Mono<Object> isSchedulePending(UUID uuid);

}
