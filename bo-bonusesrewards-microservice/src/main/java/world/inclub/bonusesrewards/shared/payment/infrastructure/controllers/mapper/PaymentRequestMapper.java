package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.MakePaymentRequest;
import world.inclub.bonusesrewards.shared.utils.TimeLima;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class PaymentRequestMapper {

    public MakePaymentCommand toCommand(MakePaymentRequest request) {

        MakePaymentCommand.Voucher voucher = request.getVoucher() == null ? null : toCommandVoucher(request.getVoucher());

        MakePaymentCommand.PayPal paypal = request.getPaypal() == null ? null : toCommandPayPal(request.getPaypal());

        BigDecimal normalizedAmount = request.getTotalAmount() == null
                ? null
                : request.getTotalAmount().setScale(2, RoundingMode.HALF_UP);

        return new MakePaymentCommand(
                request.getScheduleId(),
                request.getMemberId(),
                request.getBonusType(),
                request.getPaymentType(),
                request.getPaymentSubTypeId(),
                request.getCurrencyType(),
                voucher,
                paypal,
                normalizedAmount,
                TimeLima.getLimaTime()
        );
    }

    private MakePaymentCommand.Voucher toCommandVoucher(MakePaymentRequest.Voucher v) {
        return new MakePaymentCommand.Voucher(
            v.getOperationNumber(),
                v.getNote(),
                v.getImage()
        );
    }

    private MakePaymentCommand.PayPal toCommandPayPal(MakePaymentRequest.PayPal p) {
        return new MakePaymentCommand.PayPal(
                p.getTransactionId(),
                p.getNote()
        );
    }
}
