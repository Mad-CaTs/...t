package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.UserRewards;

@Repository
public interface UserRewardsRepository extends ReactiveCrudRepository<UserRewards, Long> {
    Mono<UserRewards> findByIdUser(Integer idUser);
}
