package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.TransferRequestDTO;
import world.inclub.transfer.liquidation.domain.entity.Transfer;

public interface ITransferPort {

	public Mono<Transfer> saveTransfer(Transfer entity);
	public Mono<Void> updateIdStatusById(Transfer entity);
}
