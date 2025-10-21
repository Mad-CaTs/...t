package world.inclub.wallet.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;

public interface IReasonDetailRetiroBankRepository extends ReactiveCrudRepository<ReasonDetailRetiroBank,Long> {
}
