package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.ClassificationWithMember;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.ClassificationWithMemberViewEntity;

@Component
public class ClassificationWithMemberMapper {

    public ClassificationWithMember toDomain(ClassificationWithMemberViewEntity entity) {
        return new ClassificationWithMember(
                entity.getClassificationId(),
                entity.getMemberId(),
                entity.getUsername(),
                entity.getFullName(),
                entity.getCountryOfResidence(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getRankId(),
                entity.getAchievedPoints(),
                entity.getRequiredPoints(),
                entity.getRequalificationCycles(),
                entity.getClassificationDate(),
                entity.getStartPeriodId(),
                entity.getEndPeriodId(),
                entity.getNotificationStatus(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public ClassificationWithMemberViewEntity toEntity(ClassificationWithMember domain) {
        ClassificationWithMemberViewEntity entity = new ClassificationWithMemberViewEntity();
        entity.setClassificationId(domain.classificationId());
        entity.setMemberId(domain.memberId());
        entity.setUsername(domain.username());
        entity.setFullName(domain.fullName());
        entity.setCountryOfResidence(domain.countryOfResidence());
        entity.setEmail(domain.email());
        entity.setPhone(domain.phone());
        entity.setRankId(domain.rankId());
        entity.setAchievedPoints(domain.achievedPoints());
        entity.setRequiredPoints(domain.requiredPoints());
        entity.setRequalificationCycles(domain.requalificationCycles());
        entity.setClassificationDate(domain.classificationDate());
        entity.setStartPeriodId(domain.startPeriodId());
        entity.setEndPeriodId(domain.endPeriodId());
        entity.setNotificationStatus(domain.notificationStatus());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

}
