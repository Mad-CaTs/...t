package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationEntity;

@Component
public class CarQuotationMapper {

    public CarQuotation toDomain(CarQuotationEntity entity) {
        if (entity == null) return null;
        return CarQuotation.builder()
                .id(entity.getId())
                .classificationId(entity.getClassificationId())
                .memberId(entity.getMemberId())
                .brand(entity.getBrand())
                .model(entity.getModel())
                .color(entity.getColor())
                .price(entity.getPriceUsd())
                .dealership(entity.getDealership())
                .executiveCountryId(entity.getExecutiveCountryId())
                .salesExecutive(entity.getSalesExecutive())
                .salesExecutivePhone(entity.getSalesExecutivePhone())
                .quotationUrl(entity.getQuotationUrl())
                .eventId(entity.getEventId())
                .initialInstallments(entity.getInitialInstallments())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CarQuotationEntity toEntity(CarQuotation domain) {
        if (domain == null) return null;
        CarQuotationEntity entity = new CarQuotationEntity();
        entity.setId(domain.id());
        entity.setClassificationId(domain.classificationId());
        entity.setMemberId(domain.memberId());
        entity.setBrand(domain.brand());
        entity.setModel(domain.model());
        entity.setColor(domain.color());
        entity.setPriceUsd(domain.price());
        entity.setDealership(domain.dealership());
        entity.setExecutiveCountryId(domain.executiveCountryId());
        entity.setSalesExecutive(domain.salesExecutive());
        entity.setSalesExecutivePhone(domain.salesExecutivePhone());
        entity.setQuotationUrl(domain.quotationUrl());
        entity.setEventId(domain.eventId());
        entity.setInitialInstallments(domain.initialInstallments());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

}
