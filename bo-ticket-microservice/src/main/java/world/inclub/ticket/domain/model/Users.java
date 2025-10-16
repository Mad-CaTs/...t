package world.inclub.ticket.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    private Integer id;
    private String email;
    private String password;
    private String sponsor;
    private Integer sponsorId;
    private String firstName;
    private String lastName;
    private String country;
    private String phone;
    private Integer documentTypeId;
    private String documentNumber;
    private Boolean status;
    private Boolean promotions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username;
    private String nationality;
    private String district;
    private String gender;
    private LocalDate birthDate;
    private String address;
}