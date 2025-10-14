package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.ticket.domain.entity.EventVenueEntity;

public interface SpringDataR2dbcEventVenueRepository extends ReactiveCrudRepository<EventVenueEntity, Integer> {
}
