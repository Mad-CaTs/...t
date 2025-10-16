package world.inclub.ticket.domain.model.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.enums.PaymentMethod;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.enums.UserType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private Long id;
    private Long userId;
    private Long eventId;
    private PaymentMethod method;
    private Integer paymentSubTypeId;
    private UserType userType;
    private PaymentStatus status;
    private CurrencyType currencyType;
    private Integer ticketQuantity ;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime rejectedAt; // Campo para tracking del rechazo
    
}
