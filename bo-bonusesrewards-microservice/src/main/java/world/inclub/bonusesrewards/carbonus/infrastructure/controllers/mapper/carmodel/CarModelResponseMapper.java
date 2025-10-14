package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carmodel;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarModelResponse;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

@Component
public class CarModelResponseMapper {

    public CarModelResponse toResponse(CarModel model) {
        return new CarModelResponse(
                model.id(),
                model.name(),
                model.brandId()
        );
    }

}
