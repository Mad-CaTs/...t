package world.inclub.membershippayment.aplication.service;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplyDiscountRequest {

    @NotNull(message = "El idSubscription no puede ser nulo")
    private Integer idSubscription;

    @NotNull(message = "El discountPercent no puede ser nulo")
    @Min(value = 1, message = "El descuento debe ser de al menos 1%")
    @Max(value = 100, message = "El descuento no puede ser mayor a 100%")
    private Integer discountPercent;
}