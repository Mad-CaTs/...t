package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CreateCarQuotationRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.UpdateCarQuotationRequest;

@Component
public class CarQuotationRequestMapper {

    public CarQuotation toDomain(CreateCarQuotationRequest request) {
        if (request == null) return null;
        return CarQuotation.builder()
                .classificationId(request.classificationId())
                .memberId(request.memberId())
                .brand(request.brandName())
                .model(request.modelName())
                .color(request.color())
                .price(request.price())
                .dealership(request.dealershipName())
                .executiveCountryId(request.executiveCountryId())
                .salesExecutive(request.salesExecutiveName())
                .salesExecutivePhone(request.salesExecutivePhone())
                .eventId(request.eventId())
                .initialInstallments(request.initialInstallments())
                .build();
    }

    public CarQuotation toDomain(UpdateCarQuotationRequest request) {
        if (request == null) return null;
        return CarQuotation.builder()
                .brand(request.brandName())
                .model(request.modelName())
                .color(request.color())
                .price(request.price())
                .dealership(request.dealershipName())
                .executiveCountryId(request.executiveCountryId())
                .salesExecutive(request.salesExecutiveName())
                .salesExecutivePhone(request.salesExecutivePhone())
                .eventId(request.eventId())
                .initialInstallments(request.initialInstallments())
                .build();
    }

}
