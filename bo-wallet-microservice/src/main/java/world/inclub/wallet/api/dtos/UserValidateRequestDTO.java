package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserValidateRequestDTO {

    private Long idUser;
    private String password;

}
