package world.inclub.wallet.infraestructure.serviceagent.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestDTO {

    private InfoEmail  infoEmail;

    private UserResponse user;

    private SponsorResponse userSponsor;


    public EmailRequestDTO(InfoEmail infoEmail, UserResponse user) {
        this.infoEmail = infoEmail;
        this.user = user;
    }



}
