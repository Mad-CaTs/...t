package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.DocumentTypeEntity;

@Component
public class DocumentTypeEntityMapper {

    public DocumentType toDomain(DocumentTypeEntity entity) {
        if (entity == null) return null;
        return DocumentType.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public DocumentTypeEntity toEntity(DocumentType domain) {
        if (domain == null) return null;
        return DocumentTypeEntity.builder()
                .id(domain.id())
                .name(domain.name())
                .build();
    }

}