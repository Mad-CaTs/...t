package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.bson.types.MaxKey;
import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.domain.model.SourceTableType;

import java.time.Instant;
import java.util.UUID;

@Component
public class PaymentFactory {

    public Payment createPaymentWithPendingStatus(MakePaymentCommand command) {
        Instant now = Instant.now();
        return Payment.builder()
                .id(UUID.randomUUID())
                .bonusTypeId(command.bonusTypeId())
                .sourceTableTypeId(SourceTableType.CAR_PAYMENT_SCHEDULES.getId())
                .sourceRecordId(command.scheduleId())
                .memberId(command.memberId())
                .paymentTypeId(command.paymentTypeId())
                .paymentSubTypeId(command.paymentSubTypeId())
                .statusId(PaymentStatus.PENDING.getId())
                .currencyTypeId(command.currencyTypeId())
                .subTotalAmount(command.subTotalAmount())
                .commissionAmount(command.commissionAmount())
                .totalAmount(command.totalAmount())
                .paymentDate(command.paymentDate())
                .createdAt(now)
                .build();
    }

    public Payment createPaymentWithCompletedStatus(MakePaymentCommand command) {
        Instant now = Instant.now();
        return Payment.builder()
                .id(UUID.randomUUID())
                .bonusTypeId(command.bonusTypeId())
                .sourceTableTypeId(SourceTableType.CAR_PAYMENT_SCHEDULES.getId())
                .sourceRecordId(command.scheduleId())
                .memberId(command.memberId())
                .paymentTypeId(command.paymentTypeId())
                .paymentSubTypeId(command.paymentSubTypeId())
                .statusId(PaymentStatus.COMPLETED.getId())
                .currencyTypeId(command.currencyTypeId())
                .subTotalAmount(command.subTotalAmount())
                .commissionAmount(command.commissionAmount())
                .totalAmount(command.totalAmount())
                .paymentDate(command.paymentDate())
                .createdAt(now)
                .build();
    }
}
