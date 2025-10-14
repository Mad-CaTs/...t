package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.codec.multipart.FilePart;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateCarQuotationRequest(
        @NotNull Long memberId,
        @NotNull UUID classificationId,
        @NotEmpty String brandName,
        @NotEmpty String modelName,
        @NotEmpty String color,
        @NotNull @Digits(integer = 12, fraction = 2) BigDecimal price,
        @NotEmpty String dealershipName,
        @NotNull Long executiveCountryId,
        @NotEmpty String salesExecutiveName,
        @NotEmpty String salesExecutivePhone,
        @NotNull FilePart quotationFile,
        @NotNull Long eventId,
        @NotNull Integer initialInstallments
) {}
