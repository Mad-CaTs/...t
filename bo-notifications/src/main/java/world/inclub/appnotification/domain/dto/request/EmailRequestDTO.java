package world.inclub.appnotification.domain.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
    public class EmailRequestDTO {


        private InfoEmail infoEmail;

        private UserResponse user;

        private UserSponsordResponse userSponsor;

        private String subject;

        private String body;

    }