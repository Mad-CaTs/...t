package world.inclub.appnotification.bonusrewards.infrastructure.email.enums;

import lombok.Getter;

@Getter
public enum BonusPaymentEmailTemplateEnum {

    PAYMENT_COMPLETED(
            "payment-completed.html",
            "Tu pago ha sido confirmado"
    ),
    PAYMENT_PENDING_REVIEW(
            "payment-pending-review.html",
            "Tu pago está pendiente de confirmación"
    ),
    PAYMENT_REJECTED(
            "payment-rejected.html",
            "Tu pago ha sido rechazado"
    );

    private static final String BASE_PATH = "templates/bonusrewards/";

    private final String templatePath;
    private final String subject;

    BonusPaymentEmailTemplateEnum(String templateName, String subject) {
        this.templatePath = BASE_PATH + templateName;
        this.subject = subject;
    }
}
