package world.inclub.membershippayment.aplication.service.mapper;

import world.inclub.membershippayment.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;

public class AccountToNotificationMapper {

    public static UserResponse mapToUserResponse(UserAccountResponse userAccount){

        if (userAccount == null) {
            return null;
        }

        return new UserResponse(
            userAccount.id.intValue(),
            userAccount.email,
            userAccount.name,
            userAccount.lastName,
            userAccount.username,
            userAccount.telephone
            
        );

    }

    public static SponsordResponse mapToSponsordResponse(UserAccountResponse userAccount){

        if (userAccount == null) {
            return null;
        }

        return new SponsordResponse(
            userAccount.id.intValue(),
            userAccount.email,
            userAccount.username,
            userAccount.name,
            userAccount.lastName,
            userAccount.telephone,
            String.valueOf(userAccount.gender),
            userAccount.idResidenceCountry.toString()
                    
        );

    }

}

