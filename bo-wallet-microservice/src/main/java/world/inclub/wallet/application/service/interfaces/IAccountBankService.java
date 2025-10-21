package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.entity.AccountBank;

public interface IAccountBankService {

    public Flux<AccountBank> getAccountBankByIdUser (Integer idUser);

}
