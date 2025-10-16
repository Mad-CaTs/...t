package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private UUID id;
    private Long memberId;
    private Integer bonusTypeId;
    private Integer paymentTypeId;
    private Integer statusId;
    private Integer currencyTypeId;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal totalAmount;
    private Instant paymentDate;
    private Instant createdAt;
    private PaymentRejectionResponseDto rejection;
}
