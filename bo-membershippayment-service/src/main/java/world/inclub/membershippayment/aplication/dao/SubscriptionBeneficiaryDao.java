package world.inclub.membershippayment.aplication.dao;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;

public interface SubscriptionBeneficiaryDao {
    Flux<SubscriptionBeneficiary> findAll();
    Mono<SubscriptionBeneficiary> findById( Long id);
    Mono<SubscriptionBeneficiary> save(SubscriptionBeneficiary suscriptionBeneficiary);
    Mono<Void> deleteById(Long id);

    Flux<SubscriptionBeneficiary> findBySubscriptionId(Long subscriptionId);

    Flux<SubscriptionBeneficiary> findByUserId(Long userId, Pageable pageable);

    Mono<Integer> countByUserId(Long userId);
}

