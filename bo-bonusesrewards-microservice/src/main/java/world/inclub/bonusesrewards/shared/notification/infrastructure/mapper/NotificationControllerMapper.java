package world.inclub.bonusesrewards.shared.notification.infrastructure.mapper;

import org.springframework.stereotype.Component;
import java.util.List;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationRequest;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class NotificationControllerMapper {
    public List<Notification> toDomainList(List<NotificationRequest> requests) {
        return requests.stream().map(this::toDomain).toList();
    }

    public Notification toDomain(NotificationRequest request) {
        return Notification.builder()
                .memberId(request.memberId())
                .typeId(request.typeId())
                .title(request.title())
                .message(request.message())
                .build();
    }

    public NotificationResponse toResponse(Notification domain) {
        return new NotificationResponse(
                domain.id(),
                domain.memberId(),
                domain.typeId(),
                domain.title(),
                domain.message(),
                domain.read(),
                DateTimeFormatter.formatInstantWithContext(domain.createdAt()),
                DateTimeFormatter.formatInstantWithContext(domain.readAt())
        );
    }

}
