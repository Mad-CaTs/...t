package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterTransferRequest {
    private String name;
    private String lastName;
    private String birthDate;
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
}
