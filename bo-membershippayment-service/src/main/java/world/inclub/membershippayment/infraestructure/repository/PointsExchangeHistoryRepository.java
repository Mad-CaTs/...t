package world.inclub.membershippayment.infraestructure.repository;


import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.membershippayment.domain.entity.PointsExchangeHistory;

@Repository
public interface PointsExchangeHistoryRepository extends ReactiveCrudRepository<PointsExchangeHistory, Long> {

    Flux<PointsExchangeHistory> findAllByIdUser(Integer idUser);

    Flux<PointsExchangeHistory> findAllByIdSuscription(Long idSuscription);
}