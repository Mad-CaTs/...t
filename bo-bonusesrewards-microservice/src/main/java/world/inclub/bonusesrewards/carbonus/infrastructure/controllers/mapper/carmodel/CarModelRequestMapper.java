package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carmodel;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarModelRequest;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

@Component
public class CarModelRequestMapper {

    public CarModel toDomain(CarModelRequest request) {
        return CarModel.builder()
                .name(request.name())
                .brandId(request.brandId())
                .build();
    }

}
