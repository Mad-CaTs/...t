package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.ticket.domain.entity.DocumentTypeEntity;

public interface SpringDataR2dbcDocumentTypeRepository extends ReactiveCrudRepository<DocumentTypeEntity, Integer> {
}
