package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentAmounts;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.domain.model.SourceTableType;
import world.inclub.bonusesrewards.shared.utils.TimeLima;

import java.time.Instant;
import java.time.LocalDateTime;

@Component
public class PaymentFactory {

    public Payment createPaymentWithPendingStatus(MakePaymentCommand command, PaymentAmounts amounts) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Payment.builder()
                .id(null)
                .bonusType(command.bonusTypeId())
                .sourceTableTypeId(SourceTableType.CAR_PAYMENT_SCHEDULES.getId())
                .sourceRecordId(command.scheduleId())
                .memberId(command.memberId())
                .paymentType(command.paymentType())
                .paymentSubTypeId(command.paymentSubTypeId())
                .status(PaymentStatus.PENDING_REVIEW)
                .currencyType(command.currencyType())
                .subTotalAmount(amounts.subTotal())
                .commissionAmount(amounts.commission())
                .totalAmount(amounts.total())
                .paymentDate(command.paymentDate())
                .createdAt(now)
                .build();
    }

    public Payment createPaymentWithApprovedStatus(MakePaymentCommand command, PaymentAmounts amounts) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Payment.builder()
                .id(null)
                .bonusType(command.bonusTypeId())
                .sourceTableTypeId(SourceTableType.CAR_PAYMENT_SCHEDULES.getId())
                .sourceRecordId(command.scheduleId())
                .memberId(command.memberId())
                .paymentType(command.paymentType())
                .paymentSubTypeId(command.paymentSubTypeId())
                .status(PaymentStatus.COMPLETED)
                .currencyType(command.currencyType())
                .subTotalAmount(amounts.subTotal())
                .commissionAmount(amounts.commission())
                .totalAmount(amounts.total())
                .paymentDate(command.paymentDate())
                .createdAt(now)
                .build();
    }
}
