package world.inclub.bonusesrewards.shared.payment.domain.model;

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
public class Payment {

    private UUID id;
    private Integer bonusTypeId;
    private Integer sourceTableTypeId;
    private UUID sourceRecordId;
    private Long memberId;
    private Integer paymentTypeId;
    private Integer paymentSubTypeId;
    private Integer statusId;
    private Integer currencyTypeId;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal totalAmount;
    private Instant paymentDate;
    private Instant createdAt;
    private Instant updatedAt;
}
