package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.entity.EventEntity;

import java.util.Collection;

public interface SpringDataR2dbcEventRepository extends ReactiveCrudRepository<EventEntity, Integer> {
    Flux<EventEntity> findByStatusEvent(String statusEvent);

    Flux<EventEntity> findByEventIdIn(Collection<Integer> eventIds);

    @Query("SELECT eventname FROM event WHERE eventid = :eventId")
    Mono<String> findEventNameById(@Param("eventId") Integer eventId);
}