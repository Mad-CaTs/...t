package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarModelEntity;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

@Component
public class CarModelMapper {

    public CarModel toDomain(CarModelEntity entity) {
        if (entity == null) return null;
        return new CarModel(
                entity.getId(),
                entity.getName(),
                entity.getBrandId()
        );
    }

    public CarModelEntity toEntity(CarModel domain) {
        if (domain == null) return null;
        return new CarModelEntity(
                domain.id(),
                domain.name(),
                domain.brandId()
        );
    }

}
