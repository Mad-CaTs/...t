package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
public class PaymentVoucherFactory {

    public PaymentVoucher createPaymentVoucher(MakePaymentCommand command, Long paymentId, String imageUrl) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentVoucher.builder()
                .paymentId(paymentId)
                .operationNumber(command.voucher().operationNumber())
                .note(command.voucher().note())
                .imageUrl(imageUrl)
                .createdAt(now)
                .build();
    }

    public PaymentVoucher createPaymentVoucher(Long paymentId, String imageUrl) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentVoucher.builder()
                .paymentId(paymentId)
                .imageUrl(imageUrl)
                .createdAt(now)
                .build();
    }

}
