package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonusdetail;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarRankBonusDetailResponse;
import world.inclub.bonusesrewards.shared.rank.infrastructure.dto.RankResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
public class CarRankBonusDetailResponseMapper {

    public CarRankBonusDetailResponse toResponse(CarRankBonusDetail domain) {
        if (domain == null) return null;
        CarRankBonusDetailResponse.StatusResponse statusResponse = toStatusResponse(domain);
        RankResponse rankResponse = toRankResponse(domain);

        return new CarRankBonusDetailResponse(
                domain.id(),
                domain.monthlyBonus(),
                domain.initialBonus(),
                domain.bonusPrice(),
                DateTimeFormatter.formatInstantToDateWithContext(domain.issueDate()),
                DateTimeFormatter.formatInstantToDateWithContext(domain.expirationDate()),
                statusResponse,
                rankResponse
        );
    }

    public PagedData<CarRankBonusDetailResponse> toResponse(PagedData<CarRankBonusDetail> pagedData) {
        return PagedDataMapper.map(pagedData, this::toResponse);
    }

    private CarRankBonusDetailResponse.StatusResponse toStatusResponse(CarRankBonusDetail domain) {
        if (domain == null) return null;
        return new CarRankBonusDetailResponse.StatusResponse(
                domain.status().getId(),
                domain.status().getCode()
        );
    }

    private RankResponse toRankResponse(CarRankBonusDetail domain) {
        if (domain == null) return null;
        return new RankResponse(
                domain.rank().id(),
                domain.rank().name()
        );
    }
}