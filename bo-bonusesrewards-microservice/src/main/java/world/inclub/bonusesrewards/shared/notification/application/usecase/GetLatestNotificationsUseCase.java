package world.inclub.bonusesrewards.shared.notification.application.usecase;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

public interface GetLatestNotificationsUseCase {

    Flux<Notification> getLatestNotifications(Long memberId, int limit);
}