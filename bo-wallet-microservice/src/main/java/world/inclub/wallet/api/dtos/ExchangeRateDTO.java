package world.inclub.wallet.api.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRateDTO {

    private int idExchangeRate;
    private double buys;
    private double sale;
    private LocalDateTime date;
    private LocalDateTime modificationDate;


}
