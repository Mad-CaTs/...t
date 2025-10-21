package world.inclub.bonusesrewards.shared.notification.application.usecase;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

import java.util.UUID;

public interface MarkAsReadUseCase {

    Mono<Notification> markAsRead(UUID notificationId);
}