package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPanelTransactionRequest {

    private Integer operationType;
    private Integer idUser;
    private Integer idUserSecondary;
    private BigDecimal amount;
    private String note;


}
