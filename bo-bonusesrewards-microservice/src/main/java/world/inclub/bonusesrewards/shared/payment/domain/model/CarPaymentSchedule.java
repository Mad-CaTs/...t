package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarPaymentSchedule
{
    private UUID id;
    private UUID carAssignmentId;
    private Integer orderNum;
    private Integer installmentNum;
    private Boolean isInitial;
    private BigDecimal financingInstallment;
    private BigDecimal insurance;
    private BigDecimal initialInstallment;
    private BigDecimal initialBonus;
    private BigDecimal gps;
    private BigDecimal monthlyBonus;
    private BigDecimal memberAssumedPayment;
    private BigDecimal total;
    private LocalDate dueDate;
    private Long statusId;
    private Instant paymentDate;
    private Instant createdAt;
    private Instant updatedAt;
}
