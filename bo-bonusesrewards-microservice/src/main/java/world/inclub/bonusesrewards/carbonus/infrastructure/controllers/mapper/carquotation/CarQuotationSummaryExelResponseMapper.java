package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarQuotationSummaryExelResponse;

@Component
public class CarQuotationSummaryExelResponseMapper {

    public CarQuotationSummaryExelResponse toExelResponse(CarQuotationSummary summary) {
        return CarQuotationSummaryExelResponse.builder()
                .username(summary.username())
                .memberFullName(summary.memberFullName())
                .countryOfResidence(summary.countryOfResidence())
                .rankName(summary.rankName())
                .lastQuotationDate(summary.lastQuotationDate())
                .reviewed(getReviewedStatus(summary.reviewed()))
                .build();
    }

    private String getReviewedStatus(Boolean reviewed) {
        if (reviewed == null) return "No Revisado";
        return reviewed ? "Revisado" : "No Revisado";
    }

}