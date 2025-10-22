package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.membershippayment.domain.entity.MovementPoint;

@Repository
public interface MovementPointRepository extends ReactiveCrudRepository<MovementPoint, Long> {
    Flux<MovementPoint> findAllByIdUser(Integer idUser);
}
