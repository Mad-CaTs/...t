package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;

@Repository
public interface SubscriptionBeneficiaryRepository extends ReactiveCrudRepository<SubscriptionBeneficiary
        , Long> {

    @Query(value = """ 
            SELECT * FROM 
                bo_membership.subscription_beneficiary 
                WHERE id_subscripcion = :subscriptionId; """)
    Flux<SubscriptionBeneficiary> findBySubscriptionId(Long subscriptionId);

    Flux<SubscriptionBeneficiary> findByUserId(Long idUser, Pageable pageable);

    Mono<Integer> countAllByUserId(Long idUser);
}
