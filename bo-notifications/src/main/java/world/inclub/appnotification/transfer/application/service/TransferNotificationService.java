package world.inclub.appnotification.transfer.application.service;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;

public interface TransferNotificationService {

    Mono<Boolean> sendTransferNotification(TransferNotificationMessage message, String subject, String template);

}
