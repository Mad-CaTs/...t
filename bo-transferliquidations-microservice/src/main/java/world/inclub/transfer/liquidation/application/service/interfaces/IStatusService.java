package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.Status;

public interface IStatusService {

    public Flux<Status> getAllStatus();

}
