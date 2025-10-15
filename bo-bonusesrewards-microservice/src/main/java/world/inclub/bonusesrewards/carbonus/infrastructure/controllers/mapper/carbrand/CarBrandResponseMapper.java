package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carbrand;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarBrandResponse;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

@Component
public class CarBrandResponseMapper {

    public CarBrandResponse toResponse(CarBrand brand) {
        return new CarBrandResponse(
                brand.id(),
                brand.name()
        );
    }

}
