package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.ClassificationExcelResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class ClassificationExcelResponseMapper {

    public ClassificationExcelResponse toResponse(ClassificationSummary summary) {
        return ClassificationExcelResponse.builder()
                .username(summary.username())
                .fullName(summary.fullName())
                .countryOfResidence(summary.countryOfResidence())
                .email(summary.email())
                .phone(summary.phone())
                .rankName(summary.rankName())
                .currentRankName(summary.currentRankName())
                .achievedPoints(summary.achievedPoints())
                .requiredPoints(summary.requiredPoints())
                .requalificationCycles(summary.requalificationCycles())
                .startDate(DateTimeFormatter.formatLocalDate(summary.startDate()))
                .endDate(DateTimeFormatter.formatLocalDate(summary.endDate()))
                .classificationDate(DateTimeFormatter.formatInstantWithContext(summary.classificationDate()))
                .notificationStatus(summary.notificationStatus() ? "Notificado" : "No Notificado")
                .build();
    }

}