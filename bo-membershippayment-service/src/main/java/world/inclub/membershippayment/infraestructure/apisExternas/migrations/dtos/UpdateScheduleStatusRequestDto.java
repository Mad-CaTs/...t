package world.inclub.membershippayment.infraestructure.apisExternas.migrations.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateScheduleStatusRequestDto {
    private Integer idSuscription;
    private Integer idStatus;
}
