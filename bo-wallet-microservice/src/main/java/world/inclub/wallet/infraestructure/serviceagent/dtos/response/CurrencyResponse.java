package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyResponse {

    private Integer idCurrency;
    private String name;
    private String abbreviation;

}
