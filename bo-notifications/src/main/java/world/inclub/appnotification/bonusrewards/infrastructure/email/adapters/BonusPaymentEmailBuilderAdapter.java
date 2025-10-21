package world.inclub.appnotification.bonusrewards.infrastructure.email.adapters;


import org.springframework.stereotype.Component;
import world.inclub.appnotification.bonusrewards.application.dto.PaymentNotificationMessage;
import world.inclub.appnotification.bonusrewards.application.enums.BonusPaymentStatus;
import world.inclub.appnotification.bonusrewards.infrastructure.email.enums.BonusPaymentEmailTemplateEnum;
import world.inclub.appnotification.shared.application.port.EmailTemplateBuilderPort;
import world.inclub.appnotification.shared.infrastructure.constants.EmailConstants;
import world.inclub.appnotification.shared.infrastructure.utils.EmailTemplateLoader;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class BonusPaymentEmailBuilderAdapter implements EmailTemplateBuilderPort<PaymentNotificationMessage> {

    private BonusPaymentStatus lastStatus;

    @Override
    public String buildHtml(PaymentNotificationMessage dto) {
        this.lastStatus = dto.status();
        return getTemplate(dto);
    }

    private static String getTemplate(PaymentNotificationMessage message) {
        return switch (message.status()) {
            case COMPLETED -> getPaymentCompletedTemplate(message);
            case PENDING_REVIEW -> getPaymentPendingReviewTemplate(message);
            case REJECTED -> getPaymentRejectedTemplate(message);
            default -> throw new IllegalArgumentException("Invalid payment status: " + message);
        };
    }

    private static String getPaymentPendingReviewTemplate(PaymentNotificationMessage message) {
        return EmailTemplateLoader.loadTemplate(BonusPaymentEmailTemplateEnum.PAYMENT_PENDING_REVIEW.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{installmentNumber}}", message.schedule().installmentNumber().toString())
                .replace("{{bonusType}}", message.payment().bonusType())
                .replace("{{totalAmount}}", message.payment().currencyType() + " " + message.payment().totalAmount().toString())
                .replace("{{paymentType}}", message.payment().paymentType())
                .replace("{{paymentSubType}}", message.payment().paymentSubType())
                .replace("{{supportEmail}}", EmailConstants.SUPPORT_EMAIL)
                .replace("{{year}}", EmailConstants.getCurrentYear());
    }

    private static String getPaymentCompletedTemplate(PaymentNotificationMessage message) {
        return EmailTemplateLoader.loadTemplate(BonusPaymentEmailTemplateEnum.PAYMENT_COMPLETED.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{paymentType}}", message.payment().paymentType())
                .replace("{{paymentSubType}}", message.payment().paymentSubType())
                .replace("{{installmentNumber}}", message.schedule().installmentNumber().toString())
                .replace("{{paymentDate}}", formatDateTime(message.payment().createdAt()))
                .replace("{{operationNumber}}", message.voucher().operationNumber())
                .replace("{{originalValue}}", message.payment().currencyType() + " " + message.payment().subTotalAmount().toString())
                .replace("{{commission}}", message.payment().currencyType() + " " + message.payment().commissionAmount().toString())
                .replace("{{finalValue}}", message.payment().currencyType() + " " + message.payment().totalAmount().toString())
                .replace("{{supportEmail}}", EmailConstants.SUPPORT_EMAIL)
                .replace("{{year}}", EmailConstants.getCurrentYear());

    }

    private static String getPaymentRejectedTemplate(PaymentNotificationMessage message) {
        return EmailTemplateLoader.loadTemplate(BonusPaymentEmailTemplateEnum.PAYMENT_REJECTED.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{rejectionDate}}", formatDateTime(message.rejectedPayment().rejectedAt()))
                .replace("{{rejectionReason}}", message.rejectedPayment().reason())
                .replace("{{rejectionDetail}}", message.rejectedPayment().detail())
                .replace("{{installmentNumber}}", message.schedule().installmentNumber().toString())
                .replace("{{totalAmount}}", message.payment().currencyType() + " " + message.payment().totalAmount().toString())
                .replace("{{supportEmail}}", EmailConstants.SUPPORT_EMAIL)
                .replace("{{year}}", EmailConstants.getCurrentYear());
    }

    private static String formatDateTime(LocalDate date, LocalTime time) {
        return date.format(DateTimeFormatter.ofPattern("EEE dd MMM", Locale.forLanguageTag("es"))).toUpperCase()
                + " | " +
                time.format(DateTimeFormatter.ofPattern("hh:mm a", Locale.forLanguageTag("es"))).toUpperCase();
    }

    private static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("EEE dd MMM | hh:mm a", Locale.forLanguageTag("es"))).toUpperCase();
    }

    @Override
    public String getSubject() {
        return switch (lastStatus) {
            case COMPLETED -> BonusPaymentEmailTemplateEnum.PAYMENT_COMPLETED.getSubject();
            case PENDING_REVIEW -> BonusPaymentEmailTemplateEnum.PAYMENT_PENDING_REVIEW.getSubject();
            case REJECTED -> BonusPaymentEmailTemplateEnum.PAYMENT_REJECTED.getSubject();
            default -> throw new IllegalArgumentException("Invalid payment status: " + lastStatus);
        };
    }
}

