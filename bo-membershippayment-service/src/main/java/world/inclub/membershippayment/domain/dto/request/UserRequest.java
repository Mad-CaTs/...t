package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.entity.CoAffiliate;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {

    private Integer idUser;
    private String name;
    private String lastName;
    private LocalDate birthDate;
    private Integer gender;
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
