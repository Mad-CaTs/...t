package world.inclub.bonusesrewards.shared.member.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.member.domain.model.Country;

public interface CountryRepositoryPort {
    Flux<Country> findByIdIn(Iterable<Long> ids);
}
