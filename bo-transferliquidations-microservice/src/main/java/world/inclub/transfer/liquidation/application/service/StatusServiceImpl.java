package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.application.service.interfaces.IStatusService;
import world.inclub.transfer.liquidation.domain.entity.Status;
import world.inclub.transfer.liquidation.domain.port.IStatusPort;

@Service
@RequiredArgsConstructor
public class StatusServiceImpl implements IStatusService{
    
    private final IStatusPort iStatusPort;
    
    @Override
    public Flux<Status> getAllStatus() {
        return iStatusPort.getAllStatus();
    }

}
