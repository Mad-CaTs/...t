package world.inclub.appnotification.payment.infrastructure.email.enums;

import lombok.Getter;

@Getter
public enum PaymentEmailTemplateEnum {

    PAYMENT_APPROVED(
            "ticket-payment-approved.html",
            "Te has unido al evento"
    ),
    PAYMENT_PENDING(
            "ticket-payment-pending.html",
            "Tu pago está pendiente de confirmación"
    ),
    PAYMENT_TEMPORAL_REJECTED(
            "ticket-payment-temporal-rejected.html",
            "Tu pago ha sido rechazado"
    );

    private static final String BASE_PATH = "templates/ticketpayment/";

    private final String templatePath;
    private final String subject;

    PaymentEmailTemplateEnum(String templateName, String subject) {
        this.templatePath = BASE_PATH + templateName;
        this.subject = subject;
    }
}
