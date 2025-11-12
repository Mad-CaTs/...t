package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.OptionReturnMoney;

public interface IOptionReturnMoneyService {

    public Flux<OptionReturnMoney> getAllOptionReturnMoney();

}
