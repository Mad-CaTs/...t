package world.inclub.bonusesrewards.shared.rank.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

public interface RankRepositoryPort {

    Flux<Rank> findAll();

    Mono<Rank> findById(Long id);

}
