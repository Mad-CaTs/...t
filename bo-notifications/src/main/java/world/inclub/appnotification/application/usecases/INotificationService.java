package world.inclub.appnotification.application.usecases;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.dto.resposne.NotificationResponse;

public interface INotificationService {

    Mono<NotificationResponse> saveNotificationUser(String correo);
    Mono<NotificationResponse> saveNotification(String correo);
}
