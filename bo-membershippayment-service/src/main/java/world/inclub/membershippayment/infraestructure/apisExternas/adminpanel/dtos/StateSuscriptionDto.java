package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StateSuscriptionDto {
    private Integer idSuscription;
    private Integer idState;
}