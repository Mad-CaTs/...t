package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.codec.multipart.FilePart;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CarAssignmentRequest(
        @Valid CarSummary car,
        @Valid CarAssignmentSummary assignment
) {
    public record CarSummary(
            @NotNull Long brandId,
            @NotNull Long modelId,
            @NotBlank String color,
            @Nullable FilePart image
    ) {}

    public record CarAssignmentSummary(
            @Nullable UUID quotationId,
            @NotNull @Positive BigDecimal price,
            @NotNull @Positive BigDecimal interestRate,
            @NotNull @Positive Integer initialInstallmentsCount,
            @NotNull @Positive Integer monthlyInstallmentsCount,
            @NotNull LocalDate paymentStartDate
    ) {}
}
