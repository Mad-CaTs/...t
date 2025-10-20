package world.inclub.appnotification.infraestructure.adapter;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.port.INotificationPort;
import world.inclub.appnotification.infraestructure.converter.NotificationConverter;
import world.inclub.appnotification.infraestructure.entity.Notification;

@Repository
public class NotificationAdapter implements INotificationPort {

    private final INotificationAdapter iNotificationRepository;

    private final NotificationConverter notificationConverter;

    public NotificationAdapter(INotificationAdapter iNotificationRepository, NotificationConverter notificationConverter) {
        this.iNotificationRepository = iNotificationRepository;
        this.notificationConverter = notificationConverter;
    }

    @Override
    public Mono<Notification> saveNotification(Notification entity) {
        return iNotificationRepository.save(entity);
    }
}