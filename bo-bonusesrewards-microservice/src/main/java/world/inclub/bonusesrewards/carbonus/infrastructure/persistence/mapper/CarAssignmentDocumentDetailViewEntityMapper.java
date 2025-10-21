package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentDetailViewEntity;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarAssignmentDocumentDetailViewEntityMapper {

    public CarAssignmentDocumentDetail toDomain(CarAssignmentDocumentDetailViewEntity entity) {
        return CarAssignmentDocumentDetail.builder()
                .id(entity.getId())
                .carAssignmentId(entity.getCarAssignmentId())
                .fileName(entity.getFileName())
                .fileUrl(entity.getFileUrl())
                .documentType(mapToDocumentType(entity))
                .fileSizeBytes(formatBytesToMB(entity.getFileSizeBytes()))
                .createdAt(DateTimeFormatter.formatInstantToDateWithContext(entity.getCreatedAt()))
                .updatedAt(DateTimeFormatter.formatInstantToDateWithContext(entity.getUpdatedAt()))
                .build();
    }

    private DocumentType mapToDocumentType(CarAssignmentDocumentDetailViewEntity entity) {
        if (entity.getDocumentTypeId() == null && entity.getDocumentTypeName() == null) {
            return null;
        }
        return DocumentType.builder()
                .id(entity.getDocumentTypeId())
                .name(entity.getDocumentTypeName())
                .build();
    }

    private String formatBytesToMB(Long bytes) {
        if (bytes == null) return "0 MB";
        double mb = bytes / (1024.0 * 1024.0);
        return String.format("%.2f MB", mb);
    }

}