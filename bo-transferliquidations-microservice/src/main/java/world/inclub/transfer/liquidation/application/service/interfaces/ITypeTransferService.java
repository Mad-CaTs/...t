package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TypeTransfer;

public interface ITypeTransferService {

    public Flux<TypeTransfer> getAllTransfer();
    public reactor.core.publisher.Mono<java.util.List<java.util.Map<String, Object>>>
            getFilteredTransferTypes(Integer idUser, String username, Integer requestedType);

}
