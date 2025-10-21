package world.inclub.wallet.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.AccountBank;
import world.inclub.wallet.domain.port.IAccountBankPort;
import world.inclub.wallet.infraestructure.repository.IAccountBankRepository;

@Repository
@RequiredArgsConstructor
public class AccountBankRepositoryImpl  implements IAccountBankPort{
    
    private final IAccountBankRepository iRepository;
    
    @Override
    public Mono<AccountBank> getAccountBankById(Long idAccountBank) {
        return iRepository.findById(idAccountBank);
    }

    @Override
    public Flux<AccountBank> getAccountBankByIdUser(Integer idUser) {
        return iRepository.findByIdUser(idUser);
    }

    @Override
    public Mono<AccountBank> saveAccountBank(AccountBank accountBank) {
        return iRepository.save(accountBank);
    }

}
