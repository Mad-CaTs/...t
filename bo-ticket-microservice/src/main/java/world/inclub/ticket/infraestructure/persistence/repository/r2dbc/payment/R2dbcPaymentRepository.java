package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment;

import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentEntity;

import java.time.LocalDate;

public interface R2dbcPaymentRepository extends R2dbcRepository<PaymentEntity, Long> {

    /**
     * Obtiene pagos pendientes ordenados por fecha de creación
     */
    Flux<PaymentEntity> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    /**
     * Cuenta pagos por estado
     */
    Mono<Long> countByStatus(String status);

    /**
     * Obtiene todos los pagos de un usuario específico ordenados por fecha de creación
     */
    Flux<PaymentEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    Flux<PaymentEntity> findByUserId(Long userId, Pageable pageable);

    /**
     * Cuenta el total de pagos de un usuario específico
     */
    Mono<Long> countByUserId(Long userId);

    Flux<PaymentEntity> findByUserIdAndStatus(Long userId, PaymentStatus status, Pageable pageable);

    Mono<Long> countByUserIdAndStatus(Long userId, PaymentStatus status);

    @Query("""
                SELECT p.*
                FROM payments p
                JOIN event e ON p.event_id = e.eventid
                WHERE p.user_id = :userId
                  AND p.status = :status
                  AND (
                      (:past = true  AND e.eventdate < :today) OR
                      (:past = false AND e.eventdate >= :today)
                  )
                ORDER BY p.created_at DESC
                LIMIT :#{#pageable.pageSize} OFFSET :#{#pageable.offset}
            """)
    Flux<PaymentEntity> findByUserIdAndStatusAndEventDateRange(
            Long userId,
            PaymentStatus status,
            boolean past,
            LocalDate today,
            Pageable pageable
    );

    @Query("""
                SELECT COUNT(*)
                FROM payments p
                JOIN event e ON p.event_id = e.eventid
                WHERE p.user_id = :userId
                  AND p.status = :status
                  AND (
                      (:past = true  AND e.eventdate < :today) OR
                      (:past = false AND e.eventdate >= :today)
                  )
            """)
    Mono<Long> countByUserIdAndStatusAndEventDateRange(
            Long userId,
            PaymentStatus status,
            boolean past,
            LocalDate today
    );

}
