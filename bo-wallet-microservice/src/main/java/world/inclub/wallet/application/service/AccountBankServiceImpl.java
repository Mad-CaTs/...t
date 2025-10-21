package world.inclub.wallet.application.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.wallet.application.service.interfaces.IAccountBankService;
import world.inclub.wallet.domain.entity.AccountBank;
import world.inclub.wallet.domain.port.IAccountBankPort;

@Service
@RequiredArgsConstructor
public class AccountBankServiceImpl implements IAccountBankService{
    
    private final IAccountBankPort iAccountBankPort;
    
    @Override
    public Flux<AccountBank> getAccountBankByIdUser(Integer idUser) {
        return iAccountBankPort.getAccountBankByIdUser(idUser);
    }

}
