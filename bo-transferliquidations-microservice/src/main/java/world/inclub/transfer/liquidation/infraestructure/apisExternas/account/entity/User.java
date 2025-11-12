package world.inclub.transfer.liquidation.infraestructure.apisExternas.account.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
/*
    private Integer idUser;
    private String stateName;
    private String nameSponsor;
    private String lastnameSponsor;
    private String emailSponsor;
    private String stateText;
    private Integer idRange;
    private LocalDateTime createDate;
    private Integer idState;
    private String name;
    private String lastname;
    private LocalDateTime birthdate;
    private String gender;
    private Integer idNationality;
    private Integer idDocument;
    private String nroDocument;
    private String civilState;
    private String email;
    private Integer idResidenceCountry;
    private String districtAddress;
    private String address;
    private String username;
    private String nroTelf;
    private Integer boolDelete;
    private String code;*/

    private Integer idUser;
    private String name;
    private String lastName;
    private LocalDateTime birthDate;
    private String gender;
    private Integer idNationality;
    private String nroDocument;
    private String email;
    private String districtAddress;
    private String address;
    private Integer idResidenceCountry;
    private Integer civilState;
    private String nroPhone;
    private Integer idTypeDocument;
    private Integer idState;
    private boolean isPromoter;
    private CoAffiliate coAffiliate;

}