package world.inclub.appnotification.passwordrecovery.infrastructure.email.enums;

import lombok.Getter;

@Getter
public enum EmailTemplateEnum {

    PASSWORD_RECOVERY_TOKEN(
            "password-recovery-token.html",
            "Recuperación de Contraseña"
    ),
    PASSWORD_RECOVERY_CONFIRMATION(
            "password-recovery-confirmation.html",
            "Contraseña restablecida"
    );

    private static final String BASE_PATH = "templates/passwordrecovery/";

    private final String templatePath;
    private final String subject;

    EmailTemplateEnum(String templateName, String subject) {
        this.templatePath = BASE_PATH + templateName;
        this.subject = subject;
    }

}
