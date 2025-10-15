package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity;

import java.time.LocalDateTime;

public record PeriodEntity(
        Long id,
        LocalDateTime initialDate,
        LocalDateTime endDate,
        LocalDateTime payDate,
        Integer status,
        Integer isActive
) {}