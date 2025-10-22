package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.membershippayment.domain.entity.PointsRedemptionHistory;

@Repository
public interface PointsRedemptionHistoryRepository extends ReactiveCrudRepository<PointsRedemptionHistory, Long> {
    Flux<PointsRedemptionHistory> findByIdUser(Integer idUser);
}