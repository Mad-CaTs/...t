package world.inclub.bonusesrewards.shared.notification.infrastructure.dto;

import jakarta.validation.constraints.NotNull;

public record NotificationRequest(
        @NotNull Long memberId,
        @NotNull Long typeId,
        @NotNull String title,
        @NotNull String message
) {}