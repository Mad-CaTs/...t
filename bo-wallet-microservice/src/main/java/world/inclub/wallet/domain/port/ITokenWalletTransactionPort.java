package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;

public interface ITokenWalletTransactionPort {

    public Flux<TokenWalletTransaction> getAlls();

    public Mono<Boolean> saveToken(TokenWalletTransaction token);

    public Mono<TokenWalletTransaction> getTokenWalletTransactionByCode(Long idWallet,String codeToken);

    


}
