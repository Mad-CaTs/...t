package world.inclub.appnotification.passwordrecovery.application.dto;

import lombok.Builder;

@Builder
public record UserMessage(
        
        Long userId,
        String email,
        String name,
        String lastName,
        String username,
        String phoneNumber
        
) {
}
