package world.inclub.membershippayment.domain.dto.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SponsordResponse {
    @NotNull
    @NotBlank(message = "El campo email no puede estar vacío")
    @Email(message = "Correo electrónico no válido")
    private Integer id;
    private String email;
    private String username;
    private String name;
    private String lastName;
    private String telephone;
    private String gender;
    private String idResidenceCountry;
}
