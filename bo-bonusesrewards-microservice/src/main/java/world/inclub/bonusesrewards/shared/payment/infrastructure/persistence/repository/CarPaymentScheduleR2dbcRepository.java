package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;


import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.CarPaymentScheduleEntity;

import java.time.Instant;
import java.util.UUID;

public interface CarPaymentScheduleR2dbcRepository extends R2dbcRepository<CarPaymentScheduleEntity, UUID> {

    @Modifying
    @Query("""
            UPDATE bo_bonus_reward.car_payment_schedules
            SET status_id = :statusId,
                payment_date = :paymentDate,
                updated_at = NOW()
            WHERE id = :scheduleId
            """)
    Mono<Integer> updateSchedulePayment(
            @Param("scheduleId") UUID scheduleId,
            @Param("statusId") Integer statusId,
            @Param("paymentDate") Instant paymentDate
    );
}
