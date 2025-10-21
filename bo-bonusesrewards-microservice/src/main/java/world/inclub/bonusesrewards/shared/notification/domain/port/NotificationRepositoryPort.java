package world.inclub.bonusesrewards.shared.notification.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.List;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

import java.util.UUID;

public interface NotificationRepositoryPort {

    Flux<Notification> saveAll(List<Notification> notifications);

    Mono<Notification> findById(UUID id);

    Flux<Notification> findLatestByMemberId(Long memberId, int limit);

    Mono<Notification> markAsRead(UUID id);
}