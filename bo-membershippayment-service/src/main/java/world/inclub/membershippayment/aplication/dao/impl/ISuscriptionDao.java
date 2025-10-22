package world.inclub.membershippayment.aplication.dao.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.infraestructure.repository.SuscriptionRepository;

import java.util.List;

@Slf4j
@Repository("suscriptionDao")
public class ISuscriptionDao implements SuscriptionDao {
    private final SuscriptionRepository suscriptionRepository;

    public ISuscriptionDao(SuscriptionRepository suscriptionRepository) {
        this.suscriptionRepository = suscriptionRepository;
    }

    @Override
    public Mono<Suscription> postSuscription(Suscription suscription) {
        return suscriptionRepository.save(suscription);
    }

    @Override
    public Flux<Suscription> findNamesByStatus(int status) {
        return suscriptionRepository.findNamesByStatus(status);
    }

    @Override
    public Flux<Suscription> findAllSuscription() {
        return suscriptionRepository.findAll();
    }

    @Override
    public Mono<Suscription> getSuscriptionById(Long id) {
        return suscriptionRepository.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Subscription not found for id: " + id)));
    }


    @Override
    public Mono<Suscription> putSuscription(Long id, int status) {
        return suscriptionRepository.findById(id)
                .flatMap(suscription -> {
                    suscription.setStatus(status);
                    return suscriptionRepository.save(suscription);
                }).doOnError(throwable -> {
                    throw new RuntimeException("Error al actualizar la suscripcion");
                });
    }

    @Override
    public Flux<Suscription> getSuscriptionsByUserId(Integer userId) {
        return suscriptionRepository.findAllByIdUser(userId);
    }

    @Override
    public Flux<Suscription> getAllByIdUserAndStatus(Integer idUser, List<Integer> statuses) {
        return suscriptionRepository.findAllByIdUserAndStatus(idUser, statuses);
    }

    @Override
    public Mono<Suscription> updateSubscription(Suscription suscription) {
        return suscriptionRepository.save(suscription);
    }

}
