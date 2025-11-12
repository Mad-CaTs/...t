package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.application.service.interfaces.IOptionReturnMoneyService;
import world.inclub.transfer.liquidation.application.service.interfaces.IReasonLiquidationService;
import world.inclub.transfer.liquidation.domain.entity.OptionReturnMoney;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;
import world.inclub.transfer.liquidation.domain.port.IOptionReturnMoneyPort;
import world.inclub.transfer.liquidation.domain.port.IReasonLiquidationPort;

@Service
@RequiredArgsConstructor
public class OptionReturnMoneyServiceImpl implements IOptionReturnMoneyService {
    
    private final IOptionReturnMoneyPort iport;

    @Override
    public Flux<OptionReturnMoney> getAllOptionReturnMoney() {
        return iport.getAllOptionReturnMoney();
    }

}
