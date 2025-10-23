package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;
import world.inclub.bonusesrewards.shared.utils.TimeLima;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class PaymentVoucherFactory {

    public PaymentVoucher createPaymentVoucher(MakePaymentCommand command, UUID paymentId, String imageUrl) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentVoucher.builder()
                .paymentId(paymentId)
                .operationNumber(command.voucher().operationNumber())
                .note(command.voucher().note())
                .imageUrl(imageUrl)
                .createdAt(now)
                .build();
    }

    public PaymentVoucher createPaymentVoucher(UUID paymentId, String imageUrl) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentVoucher.builder()
                .paymentId(paymentId)
                .imageUrl(imageUrl)
                .createdAt(now)
                .build();
    }
}
