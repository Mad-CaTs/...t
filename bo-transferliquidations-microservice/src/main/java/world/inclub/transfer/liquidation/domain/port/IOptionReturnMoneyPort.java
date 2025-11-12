package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.OptionReturnMoney;

public interface IOptionReturnMoneyPort {

	public Flux<OptionReturnMoney> getAllOptionReturnMoney();

}
