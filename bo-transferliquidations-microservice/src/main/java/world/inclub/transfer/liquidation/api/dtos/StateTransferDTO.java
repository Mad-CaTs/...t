package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateTransferDTO {
    private Integer idTransfer;
    private Integer idState;
    private LocalDateTime modificationDate;
}
