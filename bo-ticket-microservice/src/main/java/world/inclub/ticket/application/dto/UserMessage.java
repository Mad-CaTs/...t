package world.inclub.ticket.application.dto;

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
