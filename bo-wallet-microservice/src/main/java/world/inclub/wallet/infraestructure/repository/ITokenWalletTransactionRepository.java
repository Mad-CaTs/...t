package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;


import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;


public interface ITokenWalletTransactionRepository extends ReactiveCrudRepository<TokenWalletTransaction,Long> {

    @Query("SELECT * FROM bo_wallet.tokenwallettransaction WHERE idwallet = :idWallet AND codetoken = :codeToken LIMIT 1")
    public Mono<TokenWalletTransaction> findTokenByIdWalletAndCodeToken(@Param("idWallet") int idWallet, @Param("codeToken") String codeToken);

}
