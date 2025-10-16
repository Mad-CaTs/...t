package world.inclub.ticket.infraestructure.persistence.repository.adapters.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentRejectionReason;
import world.inclub.ticket.domain.ports.payment.PaymentRejectionReasonRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.payment.PaymentRejectionReasonEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment.R2dbcPaymentRejectionReasonRepository;

@Repository
@RequiredArgsConstructor
public class PaymentRejectionReasonRepositoryAdapter implements PaymentRejectionReasonRepositoryPort {

    private final R2dbcPaymentRejectionReasonRepository paymentRejectionReasonRepository;
    private final PaymentRejectionReasonEntityMapper paymentRejectionReasonEntityMapper;

    @Override
    public Flux<PaymentRejectionReason> findAll() {
        return paymentRejectionReasonRepository.findAll()
                .map(paymentRejectionReasonEntityMapper::toDomain);
    }

}
