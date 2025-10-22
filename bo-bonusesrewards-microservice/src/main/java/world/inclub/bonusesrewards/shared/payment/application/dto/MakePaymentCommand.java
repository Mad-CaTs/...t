package world.inclub.bonusesrewards.shared.payment.application.dto;

import org.springframework.http.codec.multipart.FilePart;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record MakePaymentCommand(
        UUID scheduleId,
        Long memberId,
        BonusType bonusTypeId,
        PaymentType paymentType,
        Integer paymentSubTypeId,
        CurrencyType currencyType,
        Voucher voucher,
        PayPal paypal,
        BigDecimal totalAmount,
        LocalDateTime paymentDate
) {
    public record Voucher(
            String operationNumber,
            String note,
            FilePart image
    ) {}
    public record PayPal(
            String transactionId,
            String note
    ) {}
}
