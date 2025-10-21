package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.codec.multipart.FilePart;

import java.util.UUID;

public record CarAssignmentDocumentRequest(
        @NotNull UUID carAssignmentId,
        @NotNull @Positive Long documentTypeId,
        @Nullable FilePart documentFile
) {}