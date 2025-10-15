package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.application.dto.PrequalificationSummary;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.PrequalificationResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
public class PrequalificationResponseMapper {

    public PrequalificationResponse toResponse(PrequalificationSummary summary) {
        return PrequalificationResponse.builder()
                .memberId(summary.memberId())
                .username(summary.username())
                .fullName(summary.fullName())
                .countryOfResidence(summary.countryOfResidence())
                .rankName(summary.rankName())
                .currentRankName(summary.currentRankName())
                .achievedPoints(summary.achievedPoints())
                .requiredPoints(summary.requiredPoints())
                .missingPoints(summary.missingPoints())
                .startDate(DateTimeFormatter.formatLocalDate(summary.startDate()))
                .endDate(DateTimeFormatter.formatLocalDate(summary.endDate()))
                .requalificationCycles(summary.requalificationCycles())
                .build();
    }

    public PagedData<PrequalificationResponse> toResponse(PagedData<PrequalificationSummary> pagedData) {
        return PagedDataMapper.map(pagedData, this::toResponse);
    }
}