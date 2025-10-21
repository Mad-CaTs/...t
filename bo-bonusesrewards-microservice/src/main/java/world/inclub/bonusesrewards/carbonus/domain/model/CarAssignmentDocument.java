package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentDocument(
        UUID id,
        UUID carAssignmentId,
        Long documentTypeId,
        String fileName,
        String fileUrl,
        Long fileSizeBytes,
        Instant createdAt,
        Instant updatedAt
) {}
