package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Wallet;

public interface IWalletPort {

    Flux<Wallet> getall();

    Mono<Wallet> getWalletById(Long idWallet);

    Mono<Boolean> createWalllet(Wallet wallet);

    Mono<Boolean> updateWallet( Wallet wallet);

    Mono<Wallet> getWalletByIdUser(int idUser);
}
