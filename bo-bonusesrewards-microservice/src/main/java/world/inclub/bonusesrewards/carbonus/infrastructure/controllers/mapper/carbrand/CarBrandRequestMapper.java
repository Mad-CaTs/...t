package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carbrand;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarBrandRequest;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

@Component
public class CarBrandRequestMapper {

    public CarBrand toDomain(CarBrandRequest request) {
        return CarBrand.builder()
                .name(request.name())
                .build();
    }

}
