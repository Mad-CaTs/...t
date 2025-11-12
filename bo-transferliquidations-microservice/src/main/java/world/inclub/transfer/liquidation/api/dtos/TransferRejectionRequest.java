package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// DTO used by service to create transfer rejections
public class TransferRejectionRequest {
	private Integer idTransferRequest;
	private Integer idTransferRejectionType;
	private String detailRejectionTransfer;
}
