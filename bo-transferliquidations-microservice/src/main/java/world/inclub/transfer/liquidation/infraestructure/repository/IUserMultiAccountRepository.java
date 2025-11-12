package world.inclub.transfer.liquidation.infraestructure.repository;

import java.util.Optional;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.UserMultiAccount;

public interface IUserMultiAccountRepository extends ReactiveCrudRepository<UserMultiAccount, Integer> {
    Mono<UserMultiAccount> findByParentIdAndSubAccountNumber(Long parentId, Integer subAccountNumber);
    Mono<UserMultiAccount> findByChildId(Long childId);
    Flux<UserMultiAccount> findByParentId(Long parentId);
    Mono<Void> deleteByChildId(Long childId);
}
