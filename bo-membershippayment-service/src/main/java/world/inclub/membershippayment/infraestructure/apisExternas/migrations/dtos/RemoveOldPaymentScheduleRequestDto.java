package world.inclub.membershippayment.infraestructure.apisExternas.migrations.dtos;

import lombok.Data;

@Data
public class RemoveOldPaymentScheduleRequestDto {

    private Integer idSuscription;
    private Integer idStateDelete;
}
