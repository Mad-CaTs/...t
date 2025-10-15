package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBrandEntity;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

@Component
public class CarBrandMapper {

    public CarBrand toDomain(CarBrandEntity entity) {
        if (entity == null) return null;
        return new CarBrand(
                entity.getId(),
                entity.getName()
        );
    }

    public CarBrandEntity toEntity(CarBrand domain) {
        if (domain == null) return null;
        return new CarBrandEntity(
                domain.id(),
                domain.name()
        );
    }

}
