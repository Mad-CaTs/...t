package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CarAssignmentWithClassification(
        UUID classificationId,
        UUID carAssignmentId
) {}
