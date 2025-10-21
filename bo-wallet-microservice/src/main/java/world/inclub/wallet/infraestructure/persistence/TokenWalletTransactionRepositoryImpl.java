package world.inclub.wallet.infraestructure.persistence;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;
import world.inclub.wallet.domain.port.ITokenWalletTransactionPort;
import world.inclub.wallet.infraestructure.repository.ITokenWalletTransactionRepository;

@Repository
public class TokenWalletTransactionRepositoryImpl implements ITokenWalletTransactionPort {

    private final ITokenWalletTransactionRepository iTokenWalletTransactionRepository;

    public TokenWalletTransactionRepositoryImpl(ITokenWalletTransactionRepository iTokenWalletTransactionRepository) {
        this.iTokenWalletTransactionRepository = iTokenWalletTransactionRepository;
    }

    @Override
    public Flux<TokenWalletTransaction> getAlls() {
        return iTokenWalletTransactionRepository.findAll();
    }

    @Override
    public Mono<Boolean> saveToken(TokenWalletTransaction token) {
    
        return iTokenWalletTransactionRepository.save(token)
                .map(savedToken -> true) // Si se guarda exitosamente, retorna true
                .onErrorReturn(false); // Si hay un error, retorna false
    }

    @Override
    public Mono<TokenWalletTransaction> getTokenWalletTransactionByCode(Long idWallet, String codeToken) {
        return iTokenWalletTransactionRepository.findTokenByIdWalletAndCodeToken(idWallet.intValue(), codeToken);
    }

}
