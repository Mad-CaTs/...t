package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentDocumentSummary(
        UUID carAssignmentId,
        Long memberId,
        String username,
        String memberName,
        String car,
        Long rankId,
        String rankName,
        String updatedAt,
        Integer documentCount
) {}
