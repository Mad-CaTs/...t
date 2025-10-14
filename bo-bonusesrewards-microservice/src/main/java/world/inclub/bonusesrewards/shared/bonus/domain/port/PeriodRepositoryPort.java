package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;

public interface PeriodRepositoryPort {
    Flux<Period> findByIdIn(Iterable<Long> ids);
}
