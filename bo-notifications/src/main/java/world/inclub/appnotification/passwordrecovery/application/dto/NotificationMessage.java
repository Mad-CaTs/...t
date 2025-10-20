package world.inclub.appnotification.passwordrecovery.application.dto;

import lombok.Builder;
import world.inclub.appnotification.passwordrecovery.application.enums.RecoveryMethod;

@Builder
public record NotificationMessage(

        UserMessage user,

        String token,

        RecoveryMethod method

) {
}
