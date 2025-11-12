package world.inclub.transfer.liquidation.infraestructure.apisExternas.transfer.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditUserRequest {
    private String name;
    private String lastName;
    private LocalDateTime birthdate;
    private String gender;
    private Integer idNationality;
    private String email;
    private String nroDocument;
    private String districtAddress;
    private String address;
    private Integer idResidenceCountry;
    private String civilState;
    private String nroPhone;
    private Integer idDocument;
}

