package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferObservationRequest {
    private Integer idTransferRequest;
    private Integer idTransferObservationType;
    private String detailObservationTransfer;
}
