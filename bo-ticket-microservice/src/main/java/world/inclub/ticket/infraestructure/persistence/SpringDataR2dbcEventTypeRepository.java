package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import world.inclub.ticket.domain.entity.EventTypeEntity;

@Repository
public interface SpringDataR2dbcEventTypeRepository extends ReactiveCrudRepository<EventTypeEntity, Integer> {
}
