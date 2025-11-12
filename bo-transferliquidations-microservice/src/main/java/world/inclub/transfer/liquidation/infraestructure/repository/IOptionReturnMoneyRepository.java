package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.transfer.liquidation.domain.entity.OptionReturnMoney;


public interface IOptionReturnMoneyRepository extends ReactiveCrudRepository<OptionReturnMoney,Long> {

}
