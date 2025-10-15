package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record CarPaymentScheduleInstallmentsRequest(
        @NotNull @PositiveOrZero BigDecimal gpsAmount,
        @NotNull @PositiveOrZero BigDecimal insuranceAmount,
        @NotNull @PositiveOrZero BigDecimal mandatoryInsuranceAmount
) {}
