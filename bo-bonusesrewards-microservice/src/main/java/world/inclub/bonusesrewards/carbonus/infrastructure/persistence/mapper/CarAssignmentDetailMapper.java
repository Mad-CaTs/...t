package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDetailsViewEntity;

@Component
public class CarAssignmentDetailMapper {
    
    public CarAssignmentDetail toDomain(CarAssignmentDetailsViewEntity entity) {
        if (entity == null) return null;

        CarBrand brand = CarBrand.builder()
                .id(entity.getBrandId())
                .name(entity.getBrandName())
                .build();
        
        CarModel model = CarModel.builder()
                .id(entity.getModelId())
                .name(entity.getModelName())
                .brandId(entity.getModelBrandId())
                .build();
        
        return CarAssignmentDetail.builder()
                .carId(entity.getCarId())
                .assignmentId(entity.getAssignmentId())
                .memberId(entity.getMemberId())
                .brand(brand)
                .model(model)
                .color(entity.getColor())
                .imageUrl(entity.getImageUrl())
                .price(entity.getPriceUsd())
                .interestRate(entity.getInterestRate())
                .bonusInitial(entity.getBonusInitialUsd())
                .memberInitial(entity.getMemberInitialUsd())
                .initialInstallmentsCount(entity.getInitialInstallmentsCount())
                .monthlyInstallmentsCount(entity.getMonthlyInstallmentsCount())
                .paymentStartDate(entity.getPaymentStartDate())
                .isAssigned(entity.getIsAssigned())
                .assignedDate(entity.getAssignedDate())
                .build();
    }
}