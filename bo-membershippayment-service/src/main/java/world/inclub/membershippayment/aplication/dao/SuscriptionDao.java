package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Suscription;

import java.util.List;

public interface SuscriptionDao {
    Mono<Suscription> postSuscription(Suscription suscription);
    Flux<Suscription> findNamesByStatus(int status);
    public Flux<Suscription> findAllSuscription();
    Mono<Suscription> getSuscriptionById(Long id);
    Mono<Suscription> putSuscription(Long id, int status);
    Flux<Suscription> getSuscriptionsByUserId(Integer userId);

    Flux<Suscription> getAllByIdUserAndStatus(Integer idUser, List<Integer> statuses);

    Mono<Suscription> updateSubscription(Suscription suscription);

}
