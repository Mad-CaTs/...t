package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    private Integer id;
    private String message;
    private Boolean status;
    private String accesToken;
}