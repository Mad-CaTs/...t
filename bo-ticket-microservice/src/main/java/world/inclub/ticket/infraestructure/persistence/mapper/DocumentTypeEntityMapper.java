package world.inclub.ticket.infraestructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.DocumentType;
import world.inclub.ticket.infraestructure.persistence.entity.DocumentTypeEntity;

@Component
public class DocumentTypeEntityMapper {

    public DocumentType toDomain(DocumentTypeEntity entity) {
        return new DocumentType(
                entity.getId(),
                entity.getName(),
                entity.getCountryId()
        );
    }

    public DocumentTypeEntity toEntity(DocumentType domain) {
        return new DocumentTypeEntity(
                domain.id(),
                domain.name(),
                domain.countryId()
        );
    }

}
