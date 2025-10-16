package world.inclub.ticket.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UsersResponseDto {
    private Integer id;
    private String email;
    private String sponsor;
    private Integer sponsorId;
    private String username;
    private String firstName;
    private String lastName;
    private String nationality;
    private String country;
    private String district;
    private String gender;
    private Integer documentTypeId;
    private String documentNumber;
    private String phone;
    private LocalDate birthDate;
    private String address;
    private Boolean promotions;
    private Boolean status;
}