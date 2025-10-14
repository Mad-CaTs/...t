package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.ClassificationEntity;

@Component
public class ClassificationEntityMapper {

    public ClassificationEntity toEntity(Classification domain) {
        ClassificationEntity entity = new ClassificationEntity();
        entity.setId(domain.id());
        entity.setMemberId(domain.memberId());
        entity.setRankId(domain.rankId());
        entity.setAchievedPoints(domain.achievedPoints());
        entity.setRequiredPoints(domain.requiredPoints());
        entity.setRequalificationCycles(domain.requalificationCycles());
        entity.setClassificationDate(domain.classificationDate());
        entity.setNotificationStatus(domain.notificationStatus());
        entity.setStartPeriodId(domain.startPeriodId());
        entity.setEndPeriodId(domain.endPeriodId());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

    public Classification toDomain(ClassificationEntity entity) {
        return Classification.builder()
                .id(entity.getId())
                .memberId(entity.getMemberId())
                .rankId(entity.getRankId())
                .achievedPoints(entity.getAchievedPoints())
                .requiredPoints(entity.getRequiredPoints())
                .requalificationCycles(entity.getRequalificationCycles())
                .classificationDate(entity.getClassificationDate())
                .notificationStatus(entity.getNotificationStatus())
                .startPeriodId(entity.getStartPeriodId())
                .endPeriodId(entity.getEndPeriodId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

}
