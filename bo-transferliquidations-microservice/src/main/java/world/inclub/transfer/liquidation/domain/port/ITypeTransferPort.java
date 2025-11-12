package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TypeTransfer;

public interface ITypeTransferPort {

	public Flux<TypeTransfer> getAllTypeTransfer();

}
