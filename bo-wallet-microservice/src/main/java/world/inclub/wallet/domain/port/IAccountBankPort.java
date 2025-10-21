package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.AccountBank;

public interface IAccountBankPort {

     public Mono<AccountBank> getAccountBankById(Long idAccountBank);

    public Flux<AccountBank> getAccountBankByIdUser(Integer idUser);

    public Mono<AccountBank> saveAccountBank(AccountBank accountBank);
}
