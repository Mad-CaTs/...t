package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferOldUser;
import world.inclub.transfer.liquidation.domain.port.ITransferOldUserPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ITransferOldUserRepository;

@Component
@RequiredArgsConstructor
public class TransferOldUserAdapter implements ITransferOldUserPort {

    private final ITransferOldUserRepository repository;

    @Override
    public Mono<TransferOldUser> save(TransferOldUser entity) {
        return repository.save(entity);
    }
}
