package world.inclub.appnotification.passwordrecovery.infrastructure.kafka.listeners;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.passwordrecovery.application.dto.NotificationMessage;
import world.inclub.appnotification.passwordrecovery.application.service.PasswordRecoveryService;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.adapters.PasswordRecoveryTokenBuilderAdapter;
import world.inclub.appnotification.passwordrecovery.infrastructure.kafka.constants.PasswordRecoveryKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Component
@RequiredArgsConstructor
public class PasswordRecoveryTokenConsumerListener {

    private final PasswordRecoveryService passwordRecoveryService;

    private final PasswordRecoveryTokenBuilderAdapter tokenAdapter;

    @KafkaListener(
            topics = Topic.PASSWORD_RECOVERY_NOTIFICATION_TOKEN,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "passwordRecoveryTokenKafkaListenerContainerFactory"
    )
    public void consume(NotificationMessage message) {
        String subject = tokenAdapter.getSubject();
        String templateHtml = tokenAdapter.buildHtml(message);

        passwordRecoveryService
                .sendPasswordRecovery(message, subject, templateHtml)
                .subscribe();
    }

}
