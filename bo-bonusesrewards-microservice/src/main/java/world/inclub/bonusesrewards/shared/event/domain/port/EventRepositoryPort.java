package world.inclub.bonusesrewards.shared.event.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;

public interface EventRepositoryPort {
    Flux<Event> findByIdIn(Iterable<Long> eventIds);
}
