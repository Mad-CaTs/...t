package world.inclub.wallet.infraestructure.kafka.dtos.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserAccountDTO {

    private Long idUser;
    private String name;
    private String lastName;
    private char gender;
    private String nroDocument;
    private String email;
    private String username;
    private String password;
    private Long idState;

}