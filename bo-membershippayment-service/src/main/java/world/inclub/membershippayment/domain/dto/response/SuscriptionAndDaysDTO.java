package world.inclub.membershippayment.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuscriptionAndDaysDTO {
    Integer idSuscription;
    Integer daysNextExpiration; //-1 cuando no tiene expiración
    LocalDate dateNotification;
    LocalDate dateExpiration;
    Integer daysToAnnualLiquidation;
    LocalDate liquidationDate;
}
