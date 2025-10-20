package world.inclub.appnotification.infraestructure.adapter;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.appnotification.infraestructure.entity.Notification;

public interface INotificationAdapter extends ReactiveCrudRepository<Notification, Long> {
}