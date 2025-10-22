package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Suscription;

import java.util.List;

@Repository
public interface SuscriptionRepository extends ReactiveCrudRepository<Suscription, Long> {
    Flux<Suscription> findNamesByStatus(int status);
    Flux<Suscription> findAllByIdUser(Integer idUser);

    @Query("SELECT * FROM bo_membership.suscription s WHERE s.idUser = :idUser AND s.status IN (:statuses)")
    Flux<Suscription> findAllByIdUserAndStatus(@Param("idUser") Integer idUser, @Param("statuses") List<Integer> statuses);

    Mono<Suscription> findByIdUserAndIdSuscription(Integer idUser, Integer idSuscription);

    @Query("SELECT DISTINCT idpackage FROM bo_membership.suscription WHERE iduser = :idUser and status = 1;")
    Flux<Integer> findDistinctIdPackageByIdUser(int idUser);
}

