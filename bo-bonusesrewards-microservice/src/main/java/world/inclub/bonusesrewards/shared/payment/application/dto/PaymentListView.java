package world.inclub.bonusesrewards.shared.payment.application.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record PaymentListView(
        UUID paymentId,
        String username,
        String memberFullName,
        String nrodocument,
        LocalDateTime paymentDate,
        String operationNumber,
        Long bonusTypeId,
        String bonusTypeName,
        Integer installmentNum,
        Boolean isInitial,
        String voucherImageUrl,
        Long paymentStatusId,
        String paymentStatusName
) {}
