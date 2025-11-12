package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Status;

public interface IStatusPort {

     public Flux<Status> getAllStatus();
}
