package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignment;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentRequest;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;

@Component
public class CarAssigmentRequestMapper {

    public Car toDomainCar(CarAssignmentRequest request) {
        return Car.builder()
                .brandId(request.car().brandId())
                .modelId(request.car().modelId())
                .color(request.car().color())
                .build();
    }

    public CarAssignment toDomainAssignment(CarAssignmentRequest request) {
        return CarAssignment.builder()
                .memberId(request.assignment().memberId())
                .price(request.assignment().price())
                .interestRate(request.assignment().interestRate())
                .initialInstallmentsCount(request.assignment().initialInstallmentsCount())
                .monthlyInstallmentsCount(request.assignment().monthlyInstallmentsCount())
                .paymentStartDate(request.assignment().paymentStartDate())
                .build();
    }

}
