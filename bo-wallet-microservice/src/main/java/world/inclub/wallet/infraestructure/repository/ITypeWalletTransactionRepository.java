package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;

import java.util.List;

public interface ITypeWalletTransactionRepository extends ReactiveCrudRepository<TypeWalletTransaction, Integer> {

    @Query("SELECT * FROM bo_wallet.typewallettransaction WHERE idtypewallettransaction IN (:typeBonusIds) ORDER BY idtypewallettransaction ASC")
    Flux<TypeWalletTransaction> listTypeWalletTransactionByIds(List<Integer> typeBonusIds);
}
