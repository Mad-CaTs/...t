package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenGestionBancario;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;

public interface ITokenGestionBancarioRepository extends ReactiveCrudRepository<TokenGestionBancario,Long> {
    @Query("SELECT * FROM bo_wallet.tokengestionbancaria WHERE iduser = :iduser AND codetoken = :codetoken LIMIT 1")
    public Mono<TokenGestionBancario> findTokenByIdUserAndCodeToken(@Param("iduser") int iduser, @Param("codetoken") String codetoken);

}
