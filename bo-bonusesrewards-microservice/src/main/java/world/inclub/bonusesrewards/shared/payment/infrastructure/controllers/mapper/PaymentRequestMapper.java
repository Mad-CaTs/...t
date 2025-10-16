package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.request.MakePaymentRequest;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class PaymentRequestMapper {

    public MakePaymentCommand toCommand(MakePaymentRequest request) {

        MakePaymentCommand.Voucher commandVoucher = null;
        if (request.getVouchers() != null && !request.getVouchers().isEmpty()) {
            commandVoucher = toCommandVoucher(request.getVouchers().get(0));
        }

        BigDecimal normalizedSubTotal = request.getSubTotalAmount() == null
                ? null
                : request.getSubTotalAmount().setScale(2, RoundingMode.HALF_UP);

        BigDecimal normalizedCommission = request.getCommissionAmount() == null
                ? null
                : request.getCommissionAmount().setScale(2, RoundingMode.HALF_UP);

        BigDecimal normalizedTotal = request.getTotalAmount() == null
                ? null
                : request.getTotalAmount().setScale(2, RoundingMode.HALF_UP);

        return new MakePaymentCommand(
                request.getScheduleId(),
                request.getMemberId(),
                request.getBonusTypeId(),
                request.getPaymentTypeId(),
                request.getPaymentSubTypeId(),
                request.getCurrencyTypeId(),
                normalizedSubTotal,
                normalizedCommission,
                normalizedTotal,
                commandVoucher,
                request.getPaymentDate()
        );
    }

    private MakePaymentCommand.Voucher toCommandVoucher(MakePaymentRequest.Voucher v) {
        return new MakePaymentCommand.Voucher(
                v.getOperationNumber(),
                v.getNote(),
                v.getImage()
        );
    }
}
