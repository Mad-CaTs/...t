package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSummaryViewEntity;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarQuotationSummaryViewEntityMapper {

    public CarQuotationSummary toDomain(CarQuotationSummaryViewEntity entity, Rank rank) {
        if (entity == null) return null;
        rank = rank == null ? Rank.empty() : rank;

        return CarQuotationSummary.builder()
                .classificationId(entity.getClassificationId())
                .memberId(entity.getMemberId())
                .username(entity.getUsername())
                .memberFullName(entity.getMemberFullName())
                .countryOfResidence(entity.getCountryName())
                .rankId(entity.getRankId())
                .rankName(rank.name())
                .lastQuotationDate(DateTimeFormatter.formatInstantWithContext(entity.getLastQuotationDate()))
                .reviewed(entity.getHasAnyAccepted())
                .build();
    }

}