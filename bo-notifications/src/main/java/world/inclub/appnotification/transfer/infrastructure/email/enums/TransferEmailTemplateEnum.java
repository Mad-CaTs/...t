package world.inclub.appnotification.transfer.infrastructure.email.enums;

import lombok.Getter;

@Getter
public enum TransferEmailTemplateEnum {

        TRANSFER_ACCEPTED(
                        "email_transfer_accepted.ftl",
                        "Transferencia aceptada"),
        TRANSFER_PENDING(
                        "email_transfer_pending.ftl",
                        "Transferencia pendiente"),
        TRANSFER_REJECTED(
                        "email_transfer_rejected.ftl",
                        "Transferencia rechazada"),
        TRANSFER_TO_NEW_PARTNER(
                        "email_transfer_to_new_partner.html",
                        "Nuevo socio transferido"),
        TRANSFER_DETAILS(
                        "email_transfer_details.ftl",
                        "Detalles de la transferencia"),
        TRANSFER_OBSERVATION(
                        "email_transfer_observation.ftl",
                        "Observación en transferencia");

        private static final String BASE_PATH = "transfer/";
        private final String templatePath;
        private final String subject;

        TransferEmailTemplateEnum(String templateName, String subject) {
                this.templatePath = BASE_PATH + templateName;
                this.subject = subject;
        }
}
