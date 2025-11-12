package world.inclub.transfer.liquidation.infraestructure.apisExternas.account.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountResponse {

    public Long id;
    public String email;
    public String username;
    public String name;
    public String lastName;
    public String telephone;
    public Long idResidenceCountry;
    public char gender;

}
