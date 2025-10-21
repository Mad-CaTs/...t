package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSelectedViewEntity;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarQuotationSelectedViewEntityMapper {

    public CarQuotationSelected toDomain(CarQuotationSelectedViewEntity entity, Rank rank) {
        if (entity == null) return null;
        rank = rank == null ? Rank.empty() : rank;

        return CarQuotationSelected.builder()
                .quotationId(entity.getQuotationId())
                .memberId(entity.getMemberId())
                .username(entity.getUsername())
                .memberFullName(entity.getMemberFullName())
                .countryOfResidence(entity.getCountryOfResidence())
                .rankId(entity.getRankId())
                .rankName(rank.name())
                .acceptedAt(DateTimeFormatter.formatInstantWithContext(entity.getAcceptedAt()))
                .quotationUrl(entity.getQuotationUrl())
                .build();
    }

}