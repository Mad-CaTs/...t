package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBonusApplicationDetailViewEntity;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarBonusApplicationDetailViewEntityMapper {

    public CarBonusApplicationDetail toDomain(CarBonusApplicationDetailViewEntity entity) {
        if (entity == null) return null;
        return new CarBonusApplicationDetail(
                entity.getBonusApplicationId(),
                entity.getCarAssignmentId(),
                entity.getMemberId(),
                entity.getUsername(),
                entity.getMemberFullName(),
                entity.getBonusAmount(),
                entity.getDiscountAmount(),
                entity.getDescription(),
                entity.getPaymentTypeId(),
                entity.getPaymentTypeCode(),
                entity.getIsInitial(),
                DateTimeFormatter.formatInstantWithContext(entity.getAppliedDate())
        );
    }
}