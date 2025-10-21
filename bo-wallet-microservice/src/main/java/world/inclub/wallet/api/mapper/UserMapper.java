package world.inclub.wallet.api.mapper;

import org.springframework.stereotype.Component;

import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;


public class UserMapper {

    public static UserResponse toUserResponse(UserAccountDTO user) {

        UserResponse userResponse = new UserResponse();
        userResponse.setIdUser(user.getIdUser().intValue());
        userResponse.setName(user.getName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail());
        userResponse.setUserName(user.getUsername());
        userResponse.setNroTelf("Este Response no tiene nroTelf");

        return userResponse;
    }

    public static SponsorResponse toSponsorResponse(UserAccountDTO user) {

        SponsorResponse sponsorResponseResponse = new SponsorResponse();
        sponsorResponseResponse.setIdUser(user.getIdUser().intValue());
        sponsorResponseResponse.setName(user.getName());
        sponsorResponseResponse.setLastName(user.getLastName());
        sponsorResponseResponse.setEmail(user.getEmail());
        sponsorResponseResponse.setUserName(user.getUsername());
        sponsorResponseResponse.setNroTelf("Este Response no tiene nroTelf");

        return sponsorResponseResponse;
    }

}
