package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.TypeWalletTransactionResponseDTO;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;

import java.util.List;

public interface ITypeWalletTransactionPort {

    public Mono<TypeWalletTransaction> geTypeWalletTransactionByIdUser(int idTypeWalletTransaction);
    public Flux<TypeWalletTransaction> listTypeWalletTransactionByIds(List<Integer> typeBonusIds);

}
