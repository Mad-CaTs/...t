package world.inclub.ticket.infraestructure.persistence.mapper.payment;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentDetail;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentDetailEntity;

@Component
public class PaymentDetailEntityMapper {

    public PaymentDetail toDomain(PaymentDetailEntity entity) {
        return new PaymentDetail(
                entity.getId(),
                entity.getPaymentId(),
                entity.getItemTypeId(),
                entity.getItemId(),
                entity.getTicketQuantity(),
                entity.getUnitPrice(),
                entity.getTotalPrice(),
                entity.getCreatedAt()
        );
    }

    public PaymentDetailEntity toEntity(PaymentDetail domain) {
        return new PaymentDetailEntity(
                domain.id(),
                domain.paymentId(),
                domain.itemTypeId(),
                domain.itemId(),
                domain.ticketQuantity(),
                domain.unitPrice(),
                domain.totalPrice(),
                domain.createdAt()
        );
    }

}
