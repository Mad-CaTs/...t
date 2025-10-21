package world.inclub.bonusesrewards.shared.notification.infrastructure.dto;

import java.util.UUID;

public record NotificationResponse(
        UUID id,
        Long memberId,
        Long typeId,
        String title,
        String message,
        Boolean isRead,
        String createdAt,
        String readAt
) {}