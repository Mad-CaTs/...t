package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.OptionReturnMoney;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;
import world.inclub.transfer.liquidation.domain.port.IOptionReturnMoneyPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IOptionReturnMoneyRepository;
import world.inclub.transfer.liquidation.infraestructure.repository.IReasonLiquidationRepository;

@Repository
@RequiredArgsConstructor
public class OptionReturnMoneyRepositoryImpl implements IOptionReturnMoneyPort {
    
    private final IOptionReturnMoneyRepository iRepository;

    @Override
    public Flux<OptionReturnMoney> getAllOptionReturnMoney() {
        return iRepository.findAll();
    }

}
