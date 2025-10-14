package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentDetailEntity;

public interface R2dbcPaymentDetailRepository extends R2dbcRepository<PaymentDetailEntity, Long> {}
