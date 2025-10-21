package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarQuotationSelectedExelResponse;

@Component
public class CarQuotationSelectedExelResponseMapper {

    public CarQuotationSelectedExelResponse toExelResponse(CarQuotationSelected selected) {
        return CarQuotationSelectedExelResponse.builder()
                .username(selected.username())
                .memberFullName(selected.memberFullName())
                .countryOfResidence(selected.countryOfResidence())
                .rankName(selected.rankName())
                .acceptedAt(selected.acceptedAt())
                .quotationUrl(selected.quotationUrl())
                .build();
    }

}