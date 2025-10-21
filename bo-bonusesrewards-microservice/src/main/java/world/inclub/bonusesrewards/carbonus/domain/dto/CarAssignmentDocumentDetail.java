package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;

import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentDocumentDetail(
        UUID id,
        UUID carAssignmentId,
        DocumentType documentType,
        String fileName,
        String fileUrl,
        String fileSizeBytes,
        String createdAt,
        String updatedAt
) {}
