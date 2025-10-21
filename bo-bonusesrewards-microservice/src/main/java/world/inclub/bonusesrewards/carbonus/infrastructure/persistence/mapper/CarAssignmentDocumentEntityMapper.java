package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentEntity;

@Component
public class CarAssignmentDocumentEntityMapper {

    public CarAssignmentDocument toDomain(CarAssignmentDocumentEntity entity) {
        return CarAssignmentDocument.builder()
                .id(entity.getId())
                .carAssignmentId(entity.getCarAssignmentId())
                .documentTypeId(entity.getDocumentTypeId())
                .fileName(entity.getFileName())
                .fileUrl(entity.getFileUrl())
                .fileSizeBytes(entity.getFileSizeBytes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CarAssignmentDocumentEntity toEntity(CarAssignmentDocument domain) {
        CarAssignmentDocumentEntity entity = new CarAssignmentDocumentEntity();
        entity.setId(domain.id());
        entity.setCarAssignmentId(domain.carAssignmentId());
        entity.setDocumentTypeId(domain.documentTypeId());
        entity.setFileName(domain.fileName());
        entity.setFileUrl(domain.fileUrl());
        entity.setFileSizeBytes(domain.fileSizeBytes());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }
}