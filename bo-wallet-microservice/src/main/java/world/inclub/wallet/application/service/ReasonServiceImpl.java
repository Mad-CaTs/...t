package world.inclub.wallet.application.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IReasonService;
import world.inclub.wallet.domain.entity.Reason;
import world.inclub.wallet.domain.port.IReasonPort;

@Service
public class ReasonServiceImpl implements IReasonService {

    private final IReasonPort iReasonPort;

    public ReasonServiceImpl(IReasonPort iReasonPort) {
        this.iReasonPort = iReasonPort;
    }

    @Override
    public Mono<Reason> saveReason(Reason reason) {
        return iReasonPort.saveReason(reason);
    }

    @Override
    public Mono<Reason> findById(Long idReason) {
        return iReasonPort.finByIdReason(idReason);
    }

    @Override
    public Flux<Reason> getAllReason() {
        return iReasonPort.getAllReasons();
    }
}
