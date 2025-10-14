package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarPaymentScheduleEntity;

import java.time.LocalDate;
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

}
