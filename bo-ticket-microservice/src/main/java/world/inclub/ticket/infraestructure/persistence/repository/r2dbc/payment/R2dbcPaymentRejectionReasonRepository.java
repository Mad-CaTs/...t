package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentRejectionReasonEntity;

public interface R2dbcPaymentRejectionReasonRepository extends R2dbcRepository<PaymentRejectionReasonEntity, Long> {

}
