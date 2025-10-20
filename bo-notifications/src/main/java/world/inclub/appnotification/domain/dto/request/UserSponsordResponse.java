package world.inclub.appnotification.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSponsordResponse {

    @NotNull
    @NotBlank(message = "El campo email no puede estar vacío")
    @Email(message = "Correo electrónico no válido")
    private int idUser;

    private String email;

    private String userName;

    private String name;

    private String lastName;

    private String nroTelf;
}
