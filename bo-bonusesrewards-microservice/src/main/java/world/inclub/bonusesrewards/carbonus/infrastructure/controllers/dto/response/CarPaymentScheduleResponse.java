package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CarPaymentScheduleResponse(
        UUID id,
        UUID carAssignmentId,
        Integer orderNum,
        Integer installmentNum,
        Boolean isInitial,
        BigDecimal financingInstallment,
        BigDecimal insurance,
        BigDecimal initialInstallment,
        BigDecimal initialBonus,
        BigDecimal gps,
        BigDecimal monthlyBonus,
        BigDecimal memberAssumedPayment,
        BigDecimal total,
        String dueDate,
        Status status,
        String paymentDate
) {
    public record Status(
            Long id,
            String name
    ) {}
}