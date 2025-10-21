package world.inclub.wallet.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {


    private int idUser;
    private String name;
    private String lastName;
    private String email;
    private String userName;
    private String nroTelf;
    private  String nameDestination;

    public  UserResponse(int idUser, String name, String lastName, String email){
        this.idUser=idUser;
        this.name=name;
        this.lastName = lastName;
        this.email=email;
    }

}
