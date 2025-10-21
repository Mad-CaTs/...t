package world.inclub.bonusesrewards.shared.notification.domain.model;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record Notification(
        UUID id,
        Long memberId,
        Long typeId,
        String title,
        String message,
        Boolean read,
        Instant createdAt,
        Instant readAt
) {}
