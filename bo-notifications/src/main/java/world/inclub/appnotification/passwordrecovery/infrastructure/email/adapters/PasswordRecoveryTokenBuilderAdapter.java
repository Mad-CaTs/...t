package world.inclub.appnotification.passwordrecovery.infrastructure.email.adapters;

import org.springframework.stereotype.Component;
import world.inclub.appnotification.passwordrecovery.application.dto.NotificationMessage;
import world.inclub.appnotification.shared.application.port.EmailTemplateBuilderPort;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.contants.PasswordRecoveryEmailConstants;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.enums.EmailTemplateEnum;
import world.inclub.appnotification.shared.infrastructure.utils.EmailTemplateLoader;

@Component
public class PasswordRecoveryTokenBuilderAdapter implements EmailTemplateBuilderPort<NotificationMessage> {

    @Override
    public String buildHtml(NotificationMessage dto) {
        return EmailTemplateLoader.loadTemplate(EmailTemplateEnum.PASSWORD_RECOVERY_TOKEN.getTemplatePath())
                .replace("{{fullName}}", dto.user().name() + " " + dto.user().lastName())
                .replace("{{token}}", dto.token())
                .replace("{{bannerUrl}}", PasswordRecoveryEmailConstants.BANNER_URL)
                .replace("{{year}}", PasswordRecoveryEmailConstants.getCurrentYear())
                .replace("{{supportEmail}}", PasswordRecoveryEmailConstants.SUPPORT_EMAIL);
    }

    @Override
    public String getSubject() {
        return EmailTemplateEnum.PASSWORD_RECOVERY_TOKEN.getSubject();
    }

}
