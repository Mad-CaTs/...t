package world.inclub.bonusesrewards.shared.payment.application.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record PaymentListView(
        UUID paymentId,
        String username,
        String memberFullName,
        String nrodocument,
        String operationNumber,
        Long bonusTypeId,
        String bonusTypeName,
        Integer installmentNum,
        BigDecimal subTotalAmount,
        BigDecimal commissionAmount,
        BigDecimal rateAmount,
        BigDecimal totalAmount,
        LocalDate dueDate,
        LocalDateTime paymentDate,
        String voucherImageUrl,
        Long paymentStatusId,
        String paymentStatusName
) {}
