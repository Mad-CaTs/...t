package world.inclub.ticket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.ticket.domain.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;
    private Long userId;
    private Long eventId;
    private String method;
    private Integer paymentSubTypeId;
    private String userType;
    private PaymentStatus status;
    private String currencyType;
    private Integer ticketQuantity;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private PaymentRejectionResponseDto rejection;
}
