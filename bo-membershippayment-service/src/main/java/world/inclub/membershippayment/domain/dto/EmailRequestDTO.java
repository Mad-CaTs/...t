package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.request.InfoEmail;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailRequestDTO {
    private InfoEmail infoEmail;
    private UserResponse user;
    private SponsordResponse userSponsor;
}

