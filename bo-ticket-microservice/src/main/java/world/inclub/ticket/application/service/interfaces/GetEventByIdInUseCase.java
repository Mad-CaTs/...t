package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.Event;

import java.util.Collection;

public interface GetEventByIdInUseCase {

    Flux<Event> getEventById(Collection<Integer> eventIds);

}
