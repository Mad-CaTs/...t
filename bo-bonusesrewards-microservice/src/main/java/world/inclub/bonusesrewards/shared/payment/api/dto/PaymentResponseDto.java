package world.inclub.bonusesrewards.shared.payment.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private UUID id;
    private Long memberId;
    private BonusType bonusType;
    private PaymentType paymentType;
    private PaymentStatus status;
    private CurrencyType currencyType;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal rateAmount;
    private BigDecimal ratePercentage;
    private BigDecimal totalAmount;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
}
