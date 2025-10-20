package world.inclub.appnotification.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.entity.Notification;

public interface INotificationPort {
    Mono<Notification> saveNotification(Notification entity);
}