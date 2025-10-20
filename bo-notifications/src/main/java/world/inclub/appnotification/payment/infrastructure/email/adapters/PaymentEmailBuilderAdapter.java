package world.inclub.appnotification.payment.infrastructure.email.adapters;

import org.springframework.stereotype.Component;
import world.inclub.appnotification.payment.application.dto.TicketPaymentNotificationMessage;
import world.inclub.appnotification.payment.application.enums.PaymentStatus;
import world.inclub.appnotification.payment.infrastructure.email.enums.PaymentEmailTemplateEnum;
import world.inclub.appnotification.shared.application.port.EmailTemplateBuilderPort;
import world.inclub.appnotification.shared.infrastructure.constants.EmailConstants;
import world.inclub.appnotification.shared.infrastructure.utils.EmailTemplateLoader;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class PaymentEmailBuilderAdapter implements EmailTemplateBuilderPort<TicketPaymentNotificationMessage> {

    private PaymentStatus lastStatus;

    @Override
    public String buildHtml(TicketPaymentNotificationMessage dto) {
        this.lastStatus = dto.status();
        return getTemplate(dto);
    }

    private static String getTemplate(TicketPaymentNotificationMessage message) {
        return switch (message.status()) {
            case APPROVED -> getPaymentApprovedTemplate(message);
            case PENDING -> getPaymentPendingTemplate(message);
            case TEMPORAL_REJECTED -> getPaymentTemporalRejectedTemplate(message);
            default -> throw new IllegalArgumentException("Invalid payment status: " + message);
        };
    }

    private static String getPaymentApprovedTemplate(TicketPaymentNotificationMessage message) {
        return EmailTemplateLoader.loadTemplate(PaymentEmailTemplateEnum.PAYMENT_APPROVED.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{bannerUrl}}", message.event().bannerUrl())
                .replace("{{eventName}}", message.event().name())
                .replace("{{eventDate}}", formatDateTime(message.event().eventDate(), message.event().startTime()))
                .replace("{{supportEmail}}", EmailConstants.SUPPORT_EMAIL)
                .replace("{{year}}", EmailConstants.getCurrentYear());
    }

    private static String getPaymentPendingTemplate(TicketPaymentNotificationMessage message) {
        String operationCode = String.format("%012d", message.payment().id());
        return EmailTemplateLoader.loadTemplate(PaymentEmailTemplateEnum.PAYMENT_PENDING.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{bannerUrl}}", message.event().bannerUrl())
                .replace("{{eventName}}", message.event().name())
                .replace("{{eventDate}}", formatDateTime(message.event().eventDate(), message.event().startTime()))
                .replace("{{paymentMethod}}", message.payment().method())
                .replace("{{paymentDate}}", formatDateTime(message.payment().createdAt()))
                .replace("{{operationCode}}", operationCode)
                .replace("{{originalValue}}", message.payment().currencyType() + " " + message.payment().subTotalAmount().toString())
                .replace("{{commission}}", message.payment().currencyType() + " " + message.payment().commissionAmount().toString())
                .replace("{{finalValue}}", message.payment().currencyType() + " " + message.payment().totalAmount().toString())
                .replace("{{supportEmail}}", EmailConstants.SUPPORT_EMAIL)
                .replace("{{year}}", EmailConstants.getCurrentYear());

    }

    private static String getPaymentTemporalRejectedTemplate(TicketPaymentNotificationMessage message) {
        return EmailTemplateLoader.loadTemplate(PaymentEmailTemplateEnum.PAYMENT_TEMPORAL_REJECTED.getTemplatePath())
                .replace("{{logoUrl}}", EmailConstants.LOGO_WHITE_URL)
                .replace("{{fullName}}", message.user().fullName())
                .replace("{{bannerUrl}}", message.event().bannerUrl())
                .replace("{{eventName}}", message.event().name())
                .replace("{{rejectionDate}}", formatDateTime(message.rejectedPayment().rejectedAt()))
                .replace("{{rejectionReason}}", message.rejectedPayment().reason())
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
            case APPROVED -> PaymentEmailTemplateEnum.PAYMENT_APPROVED.getSubject();
            case PENDING -> PaymentEmailTemplateEnum.PAYMENT_PENDING.getSubject();
            case TEMPORAL_REJECTED -> PaymentEmailTemplateEnum.PAYMENT_TEMPORAL_REJECTED.getSubject();
            default -> throw new IllegalArgumentException("Invalid payment status: " + lastStatus);
        };
    }
}
