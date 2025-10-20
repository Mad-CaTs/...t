package world.inclub.appnotification.passwordrecovery.infrastructure.kafka.listeners;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.passwordrecovery.application.dto.NotificationMessage;
import world.inclub.appnotification.passwordrecovery.application.service.PasswordRecoveryService;
import world.inclub.appnotification.passwordrecovery.infrastructure.email.adapters.PasswordRecoveryConfirmationBuilderAdapter;
import world.inclub.appnotification.passwordrecovery.infrastructure.kafka.constants.PasswordRecoveryKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Component
@RequiredArgsConstructor
public class PasswordRecoveryConfirmationConsumerListener {

    private final PasswordRecoveryService passwordRecoveryService;

    private final PasswordRecoveryConfirmationBuilderAdapter confirmationAdapter;

    @KafkaListener(
            topics = Topic.PASSWORD_CHANGE_NOTIFICATION,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "passwordRecoveryConfirmationKafkaListenerContainerFactory"
    )
    public void consume(NotificationMessage message) {
        String subject = confirmationAdapter.getSubject();
        String templateHtml = confirmationAdapter.buildHtml(message);

        passwordRecoveryService
                .sendPasswordRecovery(message, subject, templateHtml)
                .subscribe();
    }

}
