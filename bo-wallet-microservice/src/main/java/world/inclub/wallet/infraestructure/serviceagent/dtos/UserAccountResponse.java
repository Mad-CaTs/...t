package world.inclub.wallet.infraestructure.serviceagent.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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
    public Long idState;
    public LocalDate createDate;
    public char gender;

}
