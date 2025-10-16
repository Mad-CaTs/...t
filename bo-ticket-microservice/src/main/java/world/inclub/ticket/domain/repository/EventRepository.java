package world.inclub.ticket.domain.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.repository.base.GenericReactiveRepository;

import java.util.Collection;

public interface EventRepository extends GenericReactiveRepository<Event, Integer> {
    Flux<Event> findByStatusEvent(String statusEvent);

    Flux<Event> findByIdIn(Collection<Integer> ids);

    @Query("SELECT eventname FROM event WHERE eventid = :eventId")
    Mono<String> findEventNameById(@Param("eventId") Integer eventId);
}