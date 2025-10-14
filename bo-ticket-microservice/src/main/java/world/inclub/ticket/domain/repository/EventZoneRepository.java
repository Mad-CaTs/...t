package world.inclub.ticket.domain.repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.repository.base.GenericReactiveRepository;

import java.util.Collection;

public interface EventZoneRepository extends GenericReactiveRepository<EventZone, Integer> {
    Flux<EventZone> findByEventId(Integer eventId);

    Mono<Integer> reserveAvailableTickets(Integer eventZoneId, Integer quantity);

    /**
     * Restituye la capacidad disponible en un event zone
     * 
     * @param eventZoneId el ID del event zone
     * @param quantity la cantidad de tickets a restituir
     * @return Mono<Integer> con la nueva capacidad disponible
     */
    Mono<Integer> restoreCapacity(Integer eventZoneId, Integer quantity);

    Flux<EventZone> findByEventZoneIdIn(Collection<Integer> eventZoneIds);

    Mono<Void> deleteAllByEventZoneIdIn(Collection<Integer> eventZoneIds);
}