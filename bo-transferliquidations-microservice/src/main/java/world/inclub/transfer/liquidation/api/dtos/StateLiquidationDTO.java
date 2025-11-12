package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateLiquidationDTO {
    private Integer idLiquidation;
    private Integer idState;
    private LocalDateTime modificationDate;
}
