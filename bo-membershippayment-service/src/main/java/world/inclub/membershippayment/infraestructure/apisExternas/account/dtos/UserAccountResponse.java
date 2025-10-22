package world.inclub.membershippayment.infraestructure.apisExternas.account.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("documentNumber")
    public String nroDocument;

    @JsonProperty("id_location")
    public Integer idLocation;

}
