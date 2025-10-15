package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationDetailViewEntity;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarQuotationDetailViewEntityMapper {

    public CarQuotationDetail toDomain(CarQuotationDetailViewEntity entity, Event event) {
        if (entity == null) return null;

        String eventName = (event != null && event.name() != null)
                ? event.name()
                : "Unknown Event";

        return CarQuotationDetail.builder()
                .id(entity.getId())
                .classificationId(entity.getClassificationId())
                .memberId(entity.getMemberId())
                .username(entity.getUsername())
                .memberName(entity.getMemberName())
                .brand(entity.getBrand())
                .model(entity.getModel())
                .color(entity.getColor())
                .price(entity.getPrice())
                .dealership(entity.getDealership())
                .executiveCountryId(entity.getExecutiveCountryId())
                .salesExecutive(entity.getSalesExecutive())
                .prefixPhone(entity.getPrefixPhone())
                .salesExecutivePhone(entity.getSalesExecutivePhone())
                .quotationUrl(entity.getQuotationUrl())
                .initialInstallments(entity.getInitialInstallments())
                .eventId(entity.getEventId())
                .eventName(eventName)
                .isAccepted(entity.getIsAccepted())
                .acceptedAt(DateTimeFormatter.formatInstantWithContext(entity.getAcceptedAt()))
                .build();
    }

}