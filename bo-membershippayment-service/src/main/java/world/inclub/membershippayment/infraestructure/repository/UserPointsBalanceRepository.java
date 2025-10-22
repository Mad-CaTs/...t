package world.inclub.membershippayment.infraestructure.repository;


import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.UserPointsBalance;

@Repository
public interface UserPointsBalanceRepository extends ReactiveCrudRepository<UserPointsBalance, Long> {

    Mono<UserPointsBalance> findByIdUserAndIdFamily(Integer idUser, Integer idFamily);

}
