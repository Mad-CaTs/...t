package world.inclub.bonusesrewards.shared.bonus.domain.model;

import java.time.LocalDate;

public record Period(
        Long id,
        LocalDate startAt,
        LocalDate endAt,
        LocalDate payoutAt,
        Integer statusId,
        Integer isActive
) {}