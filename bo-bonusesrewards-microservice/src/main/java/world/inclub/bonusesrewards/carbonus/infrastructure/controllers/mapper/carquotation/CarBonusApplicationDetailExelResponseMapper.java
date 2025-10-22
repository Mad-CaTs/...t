package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarBonusApplicationDetailExelResponse;

@Component
public class CarBonusApplicationDetailExelResponseMapper {

    public CarBonusApplicationDetailExelResponse toExelResponse(CarBonusApplicationDetail domain) {
        return CarBonusApplicationDetailExelResponse.builder()
                .username(domain.username())
                .memberFullName(domain.memberFullName())
                .bonusAmount(domain.bonusAmount())
                .discountAmount(domain.discountAmount())
                .description(domain.description())
                .paymentTypeCode(domain.paymentTypeCode())
                .appliedDate(domain.appliedDate())
                .build();
    }
}