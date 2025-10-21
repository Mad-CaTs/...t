package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.wallet.domain.entity.TransactionPaypal;

public interface ITransactionPaypal extends ReactiveCrudRepository<TransactionPaypal,Long> {
}
