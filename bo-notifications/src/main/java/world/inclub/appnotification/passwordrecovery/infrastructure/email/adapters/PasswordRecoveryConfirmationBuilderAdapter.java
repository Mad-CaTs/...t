package world.inclub.appnotification.passwordrecovery.infrastructure.email.adapters;

import org.springframework.stereotype.Component;
import world.inclub.appnotification.passwordrecovery.application.dto.NotificationMessage;
import world.inclub.appnotification.passwordrecovery.application.enums.RecoveryMethod;
import world.inclub.appnotification.shared.application.port.EmailTemplateBuilderPort;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.contants.PasswordRecoveryEmailConstants;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.enums.EmailTemplateEnum;
import world.inclub.appnotification.shared.infrastructure.utils.EmailTemplateLoader;

@Component
public class PasswordRecoveryConfirmationBuilderAdapter implements EmailTemplateBuilderPort<NotificationMessage> {

    @Override
    public String buildHtml(NotificationMessage dto) {

        String message = getString(dto.method());

        return EmailTemplateLoader.loadTemplate(EmailTemplateEnum.PASSWORD_RECOVERY_CONFIRMATION.getTemplatePath())
                .replace("{{fullName}}", dto.user().name() + " " + dto.user().lastName())
                .replace("{{message}}", message)
                .replace("{{bannerUrl}}", PasswordRecoveryEmailConstants.BANNER_URL)
                .replace("{{year}}", PasswordRecoveryEmailConstants.getCurrentYear())
                .replace("{{supportEmail}}", PasswordRecoveryEmailConstants.SUPPORT_EMAIL);
    }

    private static String getString(RecoveryMethod method) {
        return switch (method) {
            case USER -> "Te confirmamos que tu contraseña se ha restablecido correctamente. Ahora puedes iniciar sesión con tu nueva credencial. ¡Gracias por confiar en nosotros!";
            case MULTICODE -> "Te confirmamos que la contraseña de tus <b>multicódigos</b> se ha restablecido correctamente. Ahora puedes iniciar sesión con tu nueva credencial. ¡Gracias por confiar en nosotros!";
            default -> throw new IllegalArgumentException("Invalid recovery method: " + method);
        };
    }

    @Override
    public String getSubject() {
        return EmailTemplateEnum.PASSWORD_RECOVERY_CONFIRMATION.getSubject();
    }

}
