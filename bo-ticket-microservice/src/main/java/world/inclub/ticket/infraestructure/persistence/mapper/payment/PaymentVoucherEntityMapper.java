package world.inclub.ticket.infraestructure.persistence.mapper.payment;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentVoucherEntity;

@Component
public class PaymentVoucherEntityMapper {

    public PaymentVoucher toDomain(PaymentVoucherEntity entity) {
        return PaymentVoucher.builder()
                .id(entity.getId())
                .paymentId(entity.getPaymentId())
                .operationNumber(entity.getOperationNumber())
                .note(entity.getNote())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public PaymentVoucherEntity toEntity(PaymentVoucher domain) {
        return PaymentVoucherEntity.builder()
                .id(domain.getId())
                .paymentId(domain.getPaymentId())
                .operationNumber(domain.getOperationNumber())
                .note(domain.getNote())
                .imageUrl(domain.getImageUrl())
                .createdAt(domain.getCreatedAt())
                .build();
    }

}
