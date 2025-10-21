package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentSummaryViewEntity;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarAssignmentDocumentSummaryViewEntityMapper {

    public CarAssignmentDocumentSummary toDomain(CarAssignmentDocumentSummaryViewEntity entity, Rank rank) {
        if (entity == null) return null;
        rank = rank == null ? Rank.empty() : rank;

        String car = String.format("%s %s - %s",
                entity.getBrandName() != null ? entity.getBrandName().toUpperCase() : "",
                entity.getModelName() != null ? entity.getModelName().toUpperCase() : "",
                entity.getCarColor() != null ? entity.getCarColor() : "").trim();

        return CarAssignmentDocumentSummary.builder()
                .carAssignmentId(entity.getCarAssignmentId())
                .memberId(entity.getMemberId())
                .username(entity.getUsername())
                .memberName(entity.getMemberFullName())
                .car(car.isEmpty() ? "Unknown Car" : car)
                .rankId(rank.id())
                .rankName(rank.name())
                .updatedAt(DateTimeFormatter.formatInstantWithContext(entity.getLastDocumentUpdatedAt()))
                .documentCount(entity.getTotalDocuments())
                .build();
    }

}