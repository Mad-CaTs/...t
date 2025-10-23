package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.annotation.Nullable;
import lombok.Builder;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;

import java.time.LocalDate;

@Builder
public record PaymentSearchRequest(
        @Nullable String member,
        @Nullable BonusType bonusType,
        @Nullable LocalDate paymentDate
) {}
