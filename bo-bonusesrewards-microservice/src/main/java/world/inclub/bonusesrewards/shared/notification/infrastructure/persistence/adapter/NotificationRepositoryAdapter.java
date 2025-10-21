package world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.domain.port.NotificationRepositoryPort;
import world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.entity.NotificationEntity;
import world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.repository.NotificationR2dbcRepository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class NotificationRepositoryAdapter
        implements NotificationRepositoryPort {

    private final NotificationR2dbcRepository notificationR2dbcRepository;

    @Override
    public Flux<Notification> saveAll(List<Notification> notifications) {
        return notificationR2dbcRepository.saveAll(
                        notifications.stream()
                                .map(this::toEntity)
                                .toList()
                )
                .map(this::toDomain);
    }

    @Override
    public Mono<Notification> findById(UUID id) {
        return notificationR2dbcRepository.findById(id)
                .map(this::toDomain);
    }

    @Override
    public Flux<Notification> findLatestByMemberId(Long memberId, int limit) {
        return notificationR2dbcRepository.findLatestByMemberId(memberId, limit)
                .map(this::toDomain);
    }

    @Override
    public Mono<Notification> markAsRead(UUID id) {
        return notificationR2dbcRepository.markAsRead(id)
                .map(this::toDomain);
    }

    private NotificationEntity toEntity(Notification notification) {
        return new NotificationEntity(
                notification.id(),
                notification.memberId(),
                notification.typeId(),
                notification.title(),
                notification.message(),
                notification.read(),
                notification.createdAt(),
                notification.readAt()
        );
    }

    private Notification toDomain(NotificationEntity entity) {
        return new Notification(
                entity.getId(),
                entity.getMemberId(),
                entity.getTypeId(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getIsRead(),
                entity.getCreatedAt(),
                entity.getReadAt()
        );
    }
}