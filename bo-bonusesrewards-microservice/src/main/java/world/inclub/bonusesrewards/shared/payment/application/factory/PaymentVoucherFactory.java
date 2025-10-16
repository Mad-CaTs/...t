package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;

import java.time.Instant;
import java.util.UUID;

@Component
public class PaymentVoucherFactory {

    public PaymentVoucher createPaymentVoucher(
            MakePaymentCommand.Voucher voucherCommand,
            UUID paymentId,
            String imageUrl) {
        Instant now = Instant.now();
        return PaymentVoucher.builder()
                .paymentId(paymentId)
                .operationNumber(voucherCommand.operationNumber())
                .note(voucherCommand.note())
                .imageUrl(imageUrl)
                .createdAt(now)
                .build();
    }
}
