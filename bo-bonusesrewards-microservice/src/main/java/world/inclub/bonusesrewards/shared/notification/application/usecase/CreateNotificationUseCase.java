package world.inclub.bonusesrewards.shared.notification.application.usecase;

import reactor.core.publisher.Flux;

import java.util.List;

import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

public interface CreateNotificationUseCase {

    /**
     * Creates multiple notifications.
     *
     * @param notifications List of notifications to be created.
     * @return A Mono emitting the list of created notifications.
     */
    Flux<Notification> createNotifications(List<Notification> notifications);

}