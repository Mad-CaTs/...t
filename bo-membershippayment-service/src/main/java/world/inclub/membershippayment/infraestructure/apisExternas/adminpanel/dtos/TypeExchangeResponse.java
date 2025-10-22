package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeExchangeResponse {
    private Integer idExchangeRate;
    private BigDecimal buys;
    private BigDecimal sale;
    private LocalDateTime date;
    private LocalDateTime modificationDate;

}
