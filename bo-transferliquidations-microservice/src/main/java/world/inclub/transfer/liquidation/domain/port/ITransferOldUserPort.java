package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferOldUser;

public interface ITransferOldUserPort {
    Mono<TransferOldUser> save(TransferOldUser entity);
}
