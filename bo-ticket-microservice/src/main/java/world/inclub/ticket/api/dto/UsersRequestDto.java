package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class UsersRequestDto {
    private String email;
    private String password;
    private String sponsor;
    private String firstName;
    private String lastName;
    private String country;
    private String phone;
    private Integer phoneCodeId;
    private Integer documentTypeId;
    private String documentNumber;
    private Boolean promotions;
    private Boolean status;
}