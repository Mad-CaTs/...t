package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private UUID id;
    private BonusType bonusType;
    private Integer sourceTableTypeId;
    private UUID sourceRecordId;
    private Long memberId;
    private PaymentType paymentType;
    private Integer paymentSubTypeId;
    private PaymentStatus status;
    private CurrencyType currencyType;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal rateAmount;
    private BigDecimal ratePercentage;
    private BigDecimal totalAmount;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
