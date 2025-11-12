package world.inclub.transfer.liquidation.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.entity.Transfer;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDTO {

	private Transfer transfer;
	// Se eliminan los detalles de transfer, ya no se usan

}
