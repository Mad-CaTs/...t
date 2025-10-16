package world.inclub.ticket.domain.repository;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventMedia;
import world.inclub.ticket.domain.repository.base.GenericReactiveRepository;

public interface EventMediaRepository extends GenericReactiveRepository<EventMedia, Integer> {
    Mono<EventMedia> findByEventId(Integer eventId);
    Mono<EventMedia> findTopByEventIdOrderByUpdatedAtDesc(Integer eventId);
}