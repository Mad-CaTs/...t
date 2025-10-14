package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.entity.EventZoneEntity;

import java.util.Collection;

public interface SpringDataR2dbcEventZoneRepository extends ReactiveCrudRepository<EventZoneEntity, Integer> {
    Flux<EventZoneEntity> findByEventId(Integer eventId);

    @Query("""
                UPDATE event_zone
                SET capacity = capacity - :quantity
                WHERE eventzoneid = :eventZoneId
                  AND capacity >= :quantity
            """)
    Mono<Integer> reserveAvailableTickets(Integer eventZoneId, Integer quantity);

    @Query("""
                UPDATE event_zone
                SET capacity = capacity + :quantity
                WHERE eventzoneid = :eventZoneId
            """)
    Mono<Integer> restoreCapacity(Integer eventZoneId, Integer quantity);

    Flux<EventZoneEntity> findByEventZoneIdIn(Collection<Integer> eventZoneIds);

    Mono<Void> deleteAllByEventZoneIdIn(Collection<Integer> eventZoneIds);

}