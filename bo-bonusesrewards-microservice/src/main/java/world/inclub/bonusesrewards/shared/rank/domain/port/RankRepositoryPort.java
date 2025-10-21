package world.inclub.bonusesrewards.shared.rank.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

import java.util.Collection;

public interface RankRepositoryPort {

    Flux<Rank> findAll();

    Mono<Rank> findById(Long id);

    Flux<Rank> findByIds(Collection<Long> ids);

}
