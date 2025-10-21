package world.inclub.wallet.infraestructure.persistence;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Reason;
import world.inclub.wallet.domain.port.IReasonPort;
import world.inclub.wallet.infraestructure.repository.IReasonRepository;

@Repository
public class ReasonRepositoryImpl implements IReasonPort {

    private final IReasonRepository reasonRepository;

    public ReasonRepositoryImpl(IReasonRepository reasonRepository) {
        this.reasonRepository = reasonRepository;
    }

    @Override
    public Mono<Reason> saveReason(Reason reason) {
        return reasonRepository.save(reason);
    }

    @Override
    public Mono<Reason> finByIdReason(Long idReason) {
        return reasonRepository.findById(idReason);
    }

    @Override
    public Flux<Reason> getAllReasons() {
        return reasonRepository.findAll();
    }

}
