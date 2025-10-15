package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarEntity;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;

@Component
public class CarMapper {
    public Car toDomain(CarEntity entity) {
        if (entity == null) return null;
        return new Car(
                entity.getId(),
                entity.getBrandId(),
                entity.getModelId(),
                entity.getColor(),
                entity.getImageUrl(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public CarEntity toEntity(Car domain) {
        if (domain == null) return null;
        CarEntity entity = new CarEntity();
        entity.setId(domain.id());
        entity.setBrandId(domain.brandId());
        entity.setModelId(domain.modelId());
        entity.setColor(domain.color());
        entity.setImageUrl(domain.imageUrl());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

}
