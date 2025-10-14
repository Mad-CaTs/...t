package world.inclub.ticket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDto {
    private String currentPassword;
    private String newPassword;
    private String repeatPassword;
    private Boolean closeOtherSessions;
}
