package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankResponse {

    private Integer idBank;
    private String name;
    private String abbreviation;
    private Integer idCountry;

}
