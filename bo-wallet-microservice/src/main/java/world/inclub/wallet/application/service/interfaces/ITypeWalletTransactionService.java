package world.inclub.wallet.application.service.interfaces;

import java.math.BigDecimal;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.TypeWalletTransactionResponseDTO;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;

public interface ITypeWalletTransactionService {

    public BigDecimal GetValueRealTypeTransaction(BigDecimal absoluteValue, int idTransactionCategory);

    public Mono<TypeWalletTransaction> getTypeWalletTransaction(int idTypeWalletTransaction);

    public Flux<TypeWalletTransaction> listTypeWalletTransaction();

}
