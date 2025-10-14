package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.PeriodEntity;

@Component
public class PeriodEntityMapper {

    public Period toDomain(PeriodEntity entity) {
        return new Period(
                entity.id(),
                entity.initialDate().toLocalDate(),
                entity.endDate().toLocalDate(),
                entity.payDate().toLocalDate(),
                entity.status(),
                entity.isActive()
        );
    }

}
