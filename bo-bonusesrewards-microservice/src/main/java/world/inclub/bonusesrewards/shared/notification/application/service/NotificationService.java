package world.inclub.bonusesrewards.shared.notification.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.application.usecase.CreateNotificationUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.GetLatestNotificationsUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.MarkAsReadUseCase;
import world.inclub.bonusesrewards.shared.notification.domain.factory.NotificationFactory;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.domain.port.NotificationRepositoryPort;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService
        implements CreateNotificationUseCase,
                   GetLatestNotificationsUseCase,
                   MarkAsReadUseCase {

    private final NotificationRepositoryPort notificationRepositoryPort;
    private final NotificationFactory notificationFactory;

    @Override
    public Flux<Notification> createNotifications(List<Notification> notifications) {
        List<Notification> newNotifications = notifications.stream()
                .map(n -> notificationFactory.create(
                        n.memberId(),
                        n.typeId(),
                        n.title(),
                        n.message()))
                .toList();
        return notificationRepositoryPort.saveAll(newNotifications);
    }

    @Override
    public Flux<Notification> getLatestNotifications(Long memberId, int limit) {
        return notificationRepositoryPort.findLatestByMemberId(memberId, limit)
                .switchIfEmpty(Flux.empty());
    }

    @Override
    public Mono<Notification> markAsRead(UUID notificationId) {
        return notificationRepositoryPort.markAsRead(notificationId);
    }

}