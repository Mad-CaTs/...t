package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.ClassificationResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
public class ClassificationResponseMapper {

    public ClassificationResponse toResponse(ClassificationSummary summary) {
        return new ClassificationResponse(
                summary.classificationId(),
                summary.memberId(),
                summary.username(),
                summary.fullName(),
                summary.countryOfResidence(),
                summary.rankName(),
                summary.currentRankName(),
                summary.achievedPoints(),
                summary.requiredPoints(),
                summary.requalificationCycles(),
                DateTimeFormatter.formatInstantWithContext(summary.classificationDate()),
                summary.notificationStatus(),
                DateTimeFormatter.formatLocalDate(summary.startDate()),
                DateTimeFormatter.formatLocalDate(summary.endDate())
        );
    }

    public PagedData<ClassificationResponse> toResponse(PagedData<ClassificationSummary> pagedData) {
        return PagedDataMapper.map(pagedData, this::toResponse);
    }

}