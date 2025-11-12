package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface ITransferAcceptanceService {
    Mono<java.util.Map<String, Object>> accept(Integer id);
}
