package world.inclub.ticket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDto {
    private String sponsor;
    private Integer sponsorId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
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
}
