package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Account;

public interface AccountRepository extends ReactiveCrudRepository<Account, Integer> {

    @Query("SELECT a.* FROM bo_account.account a WHERE a.id_account = :id LIMIT 1")
    Mono<Account> findOneById(Integer id);

    @Query("SELECT a.* FROM bo_account.account a WHERE a.username = :username LIMIT 1")
    Mono<Account> findOneByUsername(String username);
}
