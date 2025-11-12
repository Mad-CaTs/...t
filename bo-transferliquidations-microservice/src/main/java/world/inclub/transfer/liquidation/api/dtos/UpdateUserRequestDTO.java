package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDTO {
    private String username;        // usuario origen
    private Integer transferType;   // 1 o 2
    private Integer multiCode;      // requerido para tipo 2
    private UserCustomer userCustomer; // payload con datos; en tipo 2, usar userCustomer.userName como destino
    private Integer idMembership;   // requerido para tipo 3
}
