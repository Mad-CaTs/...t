package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.RewardsSuscription;

public interface RewardsUserRepository extends ReactiveCrudRepository<RewardsSuscription, Integer> {
    Mono<RewardsSuscription> findBySubscriptionId(Integer subscriptionId);
}
