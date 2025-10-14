package world.inclub.ticket.domain.repository;

import world.inclub.ticket.domain.model.EventType;
import world.inclub.ticket.domain.repository.base.GenericReactiveRepository;

/**
 * Puerto de salida para manejo de persistencia de EventType.
 */
public interface EventTypeRepository extends GenericReactiveRepository<EventType, Integer> {
}
