package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private Integer documentTypeId;
    private String documentNumber;
    private String password;
}