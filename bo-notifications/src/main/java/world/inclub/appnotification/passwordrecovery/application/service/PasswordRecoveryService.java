package world.inclub.appnotification.passwordrecovery.application.service;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.passwordrecovery.application.dto.NotificationMessage;

public interface PasswordRecoveryService {

    /**
     * Sends a password recovery notification.
     *
     * @param message the notification message containing details for the recovery
     * @param subject the subject of the notification
     * @param templateName the name of the template to use for the notification
     * @return a Mono indicating the success or failure of the operation
     */
    Mono<Boolean> sendPasswordRecovery(NotificationMessage message, String subject, String templateName);

}
