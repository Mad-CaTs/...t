package world.inclub.wallet.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SponsorResponse {

    private int idUser;
    private String name;
    private String lastName;
    private String email;
    private String userName;
    private String nroTelf;

}
