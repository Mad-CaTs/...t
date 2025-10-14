package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.PaymentResponseDto;
import world.inclub.ticket.api.dto.PaymentRejectionResponseDto;
import world.inclub.ticket.domain.model.payment.Payment;

@Component
public class PaymentMapper {
    
    public PaymentResponseDto toResponseDto(Payment payment) {
        if (payment == null) return null;
        
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .eventId(payment.getEventId())
                .method(payment.getMethod().name())
                .paymentSubTypeId(payment.getPaymentSubTypeId())
                .userType(payment.getUserType().name())
                .status(payment.getStatus())
                .currencyType(payment.getCurrencyType().name())
                .ticketQuantity(payment.getTicketQuantity())
                .subTotalAmount(payment.getSubTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .totalAmount(payment.getTotalAmount())
                .createdAt(payment.getCreatedAt())
                .rejection(null) // Se puede mejorar para incluir datos de rechazo si es necesario
                .build();
    }
}
