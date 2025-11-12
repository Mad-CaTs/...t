package world.inclub.transfer.liquidation.infraestructure.apisExternas.account.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountRegistrationResponse {

    public Long id;
    public String username;
}
