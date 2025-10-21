package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.wallet.domain.entity.Reason;

public interface IReasonRepository extends ReactiveCrudRepository<Reason, Long> {
}
