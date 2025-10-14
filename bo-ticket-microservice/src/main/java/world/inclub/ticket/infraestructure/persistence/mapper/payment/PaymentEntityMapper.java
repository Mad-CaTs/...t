package world.inclub.ticket.infraestructure.persistence.mapper.payment;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentEntity;

@Component
public class PaymentEntityMapper {

    public Payment toDomain(PaymentEntity payment) {
        return Payment.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .eventId(payment.getEventId())
                .method(payment.getMethod())
                .paymentSubTypeId(payment.getPaymentSubTypeId())
                .userType(payment.getUserType())
                .status(payment.getStatus())
                .currencyType(payment.getCurrencyType())
                .ticketQuantity(payment.getTicketQuantity())
                .subTotalAmount(payment.getSubTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .totalAmount(payment.getTotalAmount())
                .createdAt(payment.getCreatedAt())
                .rejectedAt(payment.getRejectedAt())
                .build();
    }

    public PaymentEntity toEntity(Payment payment) {
        return PaymentEntity.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .eventId(payment.getEventId())
                .method(payment.getMethod())
                .paymentSubTypeId(payment.getPaymentSubTypeId())
                .userType(payment.getUserType())
                .status(payment.getStatus())
                .currencyType(payment.getCurrencyType())
                .ticketQuantity(payment.getTicketQuantity())
                .subTotalAmount(payment.getSubTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .totalAmount(payment.getTotalAmount())
                .createdAt(payment.getCreatedAt())
                .rejectedAt(payment.getRejectedAt())
                .build();
    }

}
