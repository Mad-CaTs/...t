package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;

public interface IReasonRetiroBankRepository extends ReactiveCrudRepository<ReasonRetiroBank,Long> {

}
