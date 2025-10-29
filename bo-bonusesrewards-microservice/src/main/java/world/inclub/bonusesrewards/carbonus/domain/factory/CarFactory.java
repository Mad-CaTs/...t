package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;

@Component
public class CarFactory {

    /**
     * Prepares a car for initial save
     */
    public Car createCar(Car car, String imageUrl) {
        return Car.builder()
                .brandId(car.brandId())
                .modelId(car.modelId())
                .color(car.color())
                .imageUrl(getImageUrlOrNull(imageUrl))
                .build();
    }

    /**
     * Prepares a car for update
     */
    public Car updateCar(Car car, Car existingCar, String imageUrl) {
        return existingCar.toBuilder()
                .brandId(car.brandId())
                .modelId(car.modelId())
                .color(car.color())
                .imageUrl(getImageUrlOrNull(imageUrl) != null ? imageUrl : existingCar.imageUrl())
                .build();
    }

    private String getImageUrlOrNull(String imageUrl) {
        return imageUrl == null || imageUrl.isEmpty() ? null : imageUrl;
    }

}