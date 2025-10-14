package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.entity.EventMediaEntity;

public interface SpringDataR2dbcEventMediaRepository extends ReactiveCrudRepository<EventMediaEntity, Integer> {
    @Query("SELECT * FROM event_media WHERE event_media.eventid = :eventId")
    Mono<EventMediaEntity> findByEventId(Integer eventId);

    @Query("SELECT * FROM event_media WHERE event_media.eventid = :eventId ORDER BY event_media.updatedat DESC LIMIT 1")
    Mono<EventMediaEntity> findTopByEventIdOrderByUpdatedAtDesc(Integer eventId);
}