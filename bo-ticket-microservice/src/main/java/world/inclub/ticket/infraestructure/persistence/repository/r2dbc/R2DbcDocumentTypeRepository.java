package world.inclub.ticket.infraestructure.persistence.repository.r2dbc;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.ticket.infraestructure.persistence.entity.DocumentTypeEntity;

public interface R2DbcDocumentTypeRepository extends R2dbcRepository<DocumentTypeEntity, Integer> {}
