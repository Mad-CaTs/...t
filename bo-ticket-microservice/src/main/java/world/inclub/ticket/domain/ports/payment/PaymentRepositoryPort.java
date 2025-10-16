package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.model.payment.Payment;

import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PaymentRepositoryPort {

    Mono<Payment> save(Payment payment);

    Mono<Payment> findById(Long id);

    /**
     * Obtiene pagos pendientes ordenados por fecha de creación
     */
    Flux<Payment> findPendingPayments(Pageable pageable);

    /**
     * Cuenta pagos pendientes
     */
    Mono<Long> countPendingPayments();

    /**
     * Obtiene todos los pagos de un usuario específico
     */
    Flux<Payment> findByUserId(Long userId);

    /**
     * Obtiene todos los pagos de un usuario específico con paginación
     */
    Flux<Payment> getByUserId(Long userId, Pageable pageable);

    /**
     * Cuenta el total de pagos de un usuario específico
     */
    Mono<Long> countByUserId(Long userId);

    Flux<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status, Pageable pageable);

    Mono<Long> countByUserIdAndStatus(Long userId, PaymentStatus status);

    Flux<Payment> findByUserIdAndStatusAndEventDateRange(
            Long userId,
            PaymentStatus status,
            boolean past,
            LocalDate today,
            Pageable pageable
    );

    Mono<Long> countByUserIdAndStatusAndEventDateRange(
            Long userId,
            PaymentStatus status,
            boolean past,
            LocalDate today
    );

}
