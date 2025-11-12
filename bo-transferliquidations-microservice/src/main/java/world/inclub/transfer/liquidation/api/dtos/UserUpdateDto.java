package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String name;
    private String lastName;
    private Integer idState; // para User es int; para User enum State (mapeo por value)
    private Boolean isPromoter;
    private String newUsername; // para renombrar el username
    private java.time.LocalDateTime birthDate;
    private String gender; // se tomará el primer caracter si no es nulo/vacío
    private Integer idNationality;
    private String email;
    private String nroDocument;
    private String districtAddress;
    private String address;
    private String password;
    private Integer idResidenceCountry;
    private String civilState;
    private Boolean boolDelete;
    private String nroPhone;
    private Integer idDocument;
    private String profilePicture;
    private String code;
    private java.time.LocalDate createDate; // opcional; si llega se utilizará (inicio del día)
}
