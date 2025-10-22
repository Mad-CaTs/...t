package world.inclub.membershippayment.domain.dto.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserResponse {
    @NotNull
    @NotBlank(message = "El campo email no puede estar vacío")
    @Email(message = "Correo electrónico no válido")
    private Integer idUser;
    private String email;
    private String name;
    private String lastName;
    private String userName;
    private String nroTelf;

    public UserResponse(String name, String nroPhone, String email) {
    }
}