package world.inclub.bonusesrewards.shared.notification.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

import java.time.Instant;

@Component
public class NotificationFactory {

    public Notification create(
            Long memberId,
            Long typeId,
            String title,
            String message
    ) {
        return Notification.builder()
                .memberId(memberId)
                .typeId(typeId)
                .title(title)
                .message(message)
                .read(false)
                .createdAt(Instant.now())
                .readAt(null)
                .build();
    }

}
