package world.inclub.wallet.infraestructure.persistence;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TransactionPaypal;
import world.inclub.wallet.domain.port.ITransactionPaypalPort;
import world.inclub.wallet.infraestructure.repository.ITransactionPaypal;

@Slf4j
@Repository
public class TransactionPaypalImpl implements ITransactionPaypalPort {

    private final ITransactionPaypal iTransactionPaypal;

    public TransactionPaypalImpl(ITransactionPaypal iTransactionPaypal) {
        this.iTransactionPaypal = iTransactionPaypal;
    }

    @Override
    public Mono<String> createTransactionPaypal(TransactionPaypal transactionPaypal) {
        return iTransactionPaypal.save(transactionPaypal).thenReturn("Transacción ")  // Éxito → Mensaje de confirmación
                .onErrorResume(e -> Mono.just("Transacción: " + e.getMessage() + " - " + e.getCause()));  // Error → Descripción del error
    }
}
