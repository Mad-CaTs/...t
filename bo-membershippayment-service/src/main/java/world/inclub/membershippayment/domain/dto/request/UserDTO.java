package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.entity.CoAffiliate;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    private int idUser;
    private String stateName;
    private String nameSponsor;
    private String lastnameSponsor;
    private String stateText;
    private int idRange;
    private LocalDateTime createDate;
    private int idState;
    private String name;
    private String lastname;
    private LocalDateTime birthdate;
    private String gender;
    private int idNationality;
    private int idDocument;
    private String nroDocument;
    private String civilState;
    private String email;
    private Integer idResidenceCountry;
    private String districtAddress;
    private String address;
    private String username;
    private String nroTelf;
    private int boolDelete;
    private String code;
    private CoAffiliate coAffiliate;

    @JsonProperty("id_location")
    private Integer idLocation;
}