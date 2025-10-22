package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PercentOverdueDetail {

    private Integer idPercentOverdueDetail;
    private Integer idPercentOverdueType;
    private BigDecimal percentOverdue;
    
    private Boolean Status;
    

}
