package world.inclub.transfer.liquidation.api.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserAccountDto {

    private Long idUser;
    private String name;
    private String lastName;
    private LocalDateTime birthDate;
    private String gender;
    private Long idNationality;
    private String nroDocument;
    private String email;
    private String districtAddress;
    private String address;
    private String username;
    private String password;
    private Long idResidenceCountry;
    private String civilState;
    private Boolean boolDelete;
    private String nroPhone;
    private Long idDocument;
    private Long idState;

    private LocalDate createDate;
    private String profilePicture;
    private String code;

}