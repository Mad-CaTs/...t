package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;

import java.time.Instant;

@Component
public class CarQuotationFactory {

    public CarQuotation create(CarQuotation carQuotation, String imageUrl) {
        return CarQuotation.builder()
                .classificationId(carQuotation.classificationId())
                .brand(carQuotation.brand())
                .model(carQuotation.model())
                .color(carQuotation.color())
                .price(carQuotation.price())
                .dealership(carQuotation.dealership())
                .executiveCountryId(carQuotation.executiveCountryId())
                .salesExecutive(carQuotation.salesExecutive())
                .salesExecutivePhone(carQuotation.salesExecutivePhone())
                .quotationUrl(imageUrl)
                .eventId(carQuotation.eventId())
                .initialInstallments(carQuotation.initialInstallments())
                .isAccepted(false)
                .build();
    }

    public CarQuotation update(CarQuotation existingQuotation, CarQuotation carQuotation, String imageUrl) {
        return existingQuotation.toBuilder()
                .brand(carQuotation.brand())
                .model(carQuotation.model())
                .color(carQuotation.color())
                .price(carQuotation.price())
                .dealership(carQuotation.dealership())
                .executiveCountryId(carQuotation.executiveCountryId())
                .salesExecutive(carQuotation.salesExecutive())
                .salesExecutivePhone(carQuotation.salesExecutivePhone())
                .quotationUrl(imageUrl != null ? imageUrl : existingQuotation.quotationUrl())
                .eventId(carQuotation.eventId())
                .initialInstallments(carQuotation.initialInstallments())
                .isAccepted(false)
                .build();
    }

    public CarQuotation accept(CarQuotation existingQuotation) {
        return existingQuotation.toBuilder()
                .isAccepted(true)
                .acceptedAt(Instant.now())
                .build();
    }

}