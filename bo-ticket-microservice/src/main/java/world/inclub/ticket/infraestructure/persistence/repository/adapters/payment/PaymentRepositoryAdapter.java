package world.inclub.ticket.infraestructure.persistence.repository.adapters.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.ports.payment.PaymentRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.payment.PaymentEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment.R2dbcPaymentRepository;

import java.time.LocalDate;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepositoryPort {

    private final R2dbcPaymentRepository paymentRepository;
    private final PaymentEntityMapper paymentEntityMapper;

    @Override
    public Mono<Payment> save(Payment entity) {
        return paymentRepository.save(paymentEntityMapper.toEntity(entity)).map(paymentEntityMapper::toDomain);
    }

    @Override
    public Mono<Payment> findById(Long id) {
        return paymentRepository.findById(id).map(paymentEntityMapper::toDomain);
    }

    @Override
    public Flux<Payment> findPendingPayments(Pageable pageable) {
        return paymentRepository.findByStatusOrderByCreatedAtDesc("PENDING", pageable)
                .map(paymentEntityMapper::toDomain);
    }

    @Override
    public Mono<Long> countPendingPayments() {
        return paymentRepository.countByStatus("PENDING");
    }

    @Override
    public Flux<Payment> findByUserId(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .map(paymentEntityMapper::toDomain);
    }
    
    @Override
    public Flux<Payment> getByUserId(Long userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable)
                .map(paymentEntityMapper::toDomain);
    }
    
    @Override
    public Mono<Long> countByUserId(Long userId) {
        return paymentRepository.countByUserId(userId);
    }

    @Override
    public Flux<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status, Pageable pageable) {
        return paymentRepository.findByUserIdAndStatus(userId, status, pageable)
                .map(paymentEntityMapper::toDomain);
    }

    @Override
    public Mono<Long> countByUserIdAndStatus(Long userId, PaymentStatus status) {
        return paymentRepository.countByUserIdAndStatus(userId, status);
    }

    @Override
    public Flux<Payment> findByUserIdAndStatusAndEventDateRange(Long userId, PaymentStatus status, boolean past, LocalDate today, Pageable pageable) {
        return paymentRepository.findByUserIdAndStatusAndEventDateRange(userId, status, past, today, pageable)
                .map(paymentEntityMapper::toDomain);
    }

    @Override
    public Mono<Long> countByUserIdAndStatusAndEventDateRange(Long userId, PaymentStatus status, boolean past, LocalDate today) {
        return paymentRepository.countByUserIdAndStatusAndEventDateRange(userId, status, past, today);
    }

}
