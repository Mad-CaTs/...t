package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import world.inclub.ticket.domain.entity.TicketTypeEntity;

@Repository
public interface SpringDataR2dbcTicketTypeRepository extends ReactiveCrudRepository<TicketTypeEntity, Integer> {
}
