package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarPaymentScheduleEntity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public interface CarPaymentScheduleR2dbcRepository
        extends R2dbcRepository<CarPaymentScheduleEntity, UUID> {

    Flux<CarPaymentScheduleEntity> findByIsInitialTrueAndStatusIdAndDueDateLessThan(
            Long statusId,
            LocalDate dueDateLessThan
    );

    Flux<CarPaymentScheduleEntity> findByIsInitialFalseAndStatusIdAndDueDateLessThanEqual(
            Long statusId,
            LocalDate dueDateLessThanEqual
    );

    Mono<CarPaymentScheduleEntity> findFirstByCarAssignmentIdOrderByOrderNumDesc(UUID carAssignmentId);

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
            @Param("paymentDate") LocalDateTime paymentDate
    );

    @Query("""
            SELECT ca.member_id
            FROM bo_bonus_reward.car_payment_schedules cps
            INNER JOIN bo_bonus_reward.car_assignments ca ON cps.car_assignment_id = ca.id
            WHERE cps.id = :scheduleId
            """)
    Mono<Long> getMemberIdByScheduleId(@Param("scheduleId") UUID scheduleId);
}
