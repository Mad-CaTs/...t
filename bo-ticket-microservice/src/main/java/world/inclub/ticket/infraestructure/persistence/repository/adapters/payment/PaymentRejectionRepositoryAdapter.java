package world.inclub.ticket.infraestructure.persistence.repository.adapters.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.payment.PaymentRejection;
import world.inclub.ticket.domain.ports.payment.PaymentRejectionRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.payment.PaymentRejectionEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment.R2dbcPaymentRejectionRepository;

@Repository
@RequiredArgsConstructor
public class PaymentRejectionRepositoryAdapter implements PaymentRejectionRepositoryPort {

    private final R2dbcPaymentRejectionRepository paymentRejectionRepository;
    private final PaymentRejectionEntityMapper paymentRejectionEntityMapper;

    @Override
    public Mono<PaymentRejection> save(PaymentRejection paymentRejection) {
        return paymentRejectionRepository.save(paymentRejectionEntityMapper.toEntity(paymentRejection))
                .map(paymentRejectionEntityMapper::toDomain);
    }

    @Override
    public Mono<PaymentRejection> findByPaymentId(Long paymentId) {
        return paymentRejectionRepository.findByPaymentId(paymentId)
                .map(paymentRejectionEntityMapper::toDomain);
    }

}
