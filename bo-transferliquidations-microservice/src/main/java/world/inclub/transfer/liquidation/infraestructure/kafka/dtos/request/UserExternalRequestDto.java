package world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserExternalRequestDto {
    private Integer idUser;
    private String name;
    private String lastName;
    private LocalDateTime birthdate;
    private String gender;
    private Integer idNationality;
    private String email;
    private String nroDocument;
    private String districtAddress;
    private String address;
    private String userName;
    private String password;
    private Integer idResidenceCountry;
    private String civilState;
    private Integer boolDelete;
    private String nroPhone;
    private Integer idDocument;
    private Integer idState;
    private LocalDateTime createDate;
    private String profilePicture;
    private String code;
    private Integer idLocation;
}
