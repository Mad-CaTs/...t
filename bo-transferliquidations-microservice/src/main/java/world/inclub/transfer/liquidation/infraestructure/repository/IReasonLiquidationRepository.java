package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;


public interface IReasonLiquidationRepository extends ReactiveCrudRepository<ReasonLiquidation,Long> {

}
