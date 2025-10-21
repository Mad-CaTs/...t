package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import reactor.util.function.Tuple2;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentNotificationMessage;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;

@Component
public class PaymentNotificationFactory {

    public PaymentNotificationMessage toApprovedPaymentMessage(
            Tuple2<String, String> userData,
            Payment payment,
            CarPaymentSchedule schedule,
            PaymentVoucher voucher,
            String paymentSubTypeName
    ) {
        return PaymentNotificationMessage.builder()
                .user(PaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .schedule(PaymentNotificationMessage.Schedule.builder()
                        .installmentNumber(schedule.installmentNum())
                        .build())
                .payment(PaymentNotificationMessage.Payment.builder()
                        .bonusType(payment.getBonusType().getCode())
                        .paymentType(payment.getPaymentType().getCode())
                        .paymentSubType(paymentSubTypeName)
                        .currencyType(payment.getCurrencyType().getCode())
                        .currencySymbol(payment.getCurrencyType().getSymbol())
                        .subTotalAmount(payment.getSubTotalAmount())
                        .commissionAmount(payment.getCommissionAmount())
                        .totalAmount(payment.getTotalAmount())
                        .createdAt(payment.getCreatedAt())
                        .build())
                .voucher(PaymentNotificationMessage.Voucher.builder()
                        .operationNumber(voucher.getOperationNumber())
                        .build())
                .status(payment.getStatus())
                .build();
    }

    public PaymentNotificationMessage toPendingReviewPaymentMessage(
            Tuple2<String, String> userData,
            Payment payment,
            CarPaymentSchedule schedule,
            String paymentSubTypeName
    ) {
        return PaymentNotificationMessage.builder()
                .user(PaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .schedule(PaymentNotificationMessage.Schedule.builder()
                        .installmentNumber(schedule.installmentNum())
                        .build())
                .payment(PaymentNotificationMessage.Payment.builder()
                        .bonusType(payment.getBonusType().getCode())
                        .paymentType(payment.getPaymentType().getCode())
                        .paymentSubType(paymentSubTypeName)
                        .currencyType(payment.getCurrencyType().getCode())
                        .currencySymbol(payment.getCurrencyType().getSymbol())
                        .totalAmount(payment.getTotalAmount())
                        .build())
                .status(payment.getStatus())
                .build();
    }

    public PaymentNotificationMessage toRejectedPaymentMessage(
            Tuple2<String, String> userData,
            Payment payment,
            CarPaymentSchedule schedule,
            PaymentRejection rejection,
            String rejectionReasonName
    ) {
        return PaymentNotificationMessage.builder()
                .user(PaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .schedule(PaymentNotificationMessage.Schedule.builder()
                        .installmentNumber(schedule.installmentNum())
                        .build())
                .payment(PaymentNotificationMessage.Payment.builder()
                        .bonusType(payment.getBonusType().getCode())
                        .currencyType(payment.getCurrencyType().getCode())
                        .currencySymbol(payment.getCurrencyType().getSymbol())
                        .totalAmount(payment.getTotalAmount())
                        .build())
                .rejectedPayment(PaymentNotificationMessage.RejectedPayment.builder()
                        .reason(rejectionReasonName)
                        .detail(rejection.getNote())
                        .rejectedAt(rejection.getCreatedAt())
                        .build())
                .status(payment.getStatus())
                .build();
    }
}
