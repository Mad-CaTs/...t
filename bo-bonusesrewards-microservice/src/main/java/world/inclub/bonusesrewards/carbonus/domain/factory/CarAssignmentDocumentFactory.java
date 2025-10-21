package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

@Component
public class CarAssignmentDocumentFactory {

    public CarAssignmentDocument create(
            CarAssignmentDocument document,
            FileResource fileResource,
            String fileUrl
    ) {
        return CarAssignmentDocument.builder()
                .carAssignmentId(document.carAssignmentId())
                .documentTypeId(document.documentTypeId())
                .fileName(fileResource.filename())
                .fileUrl(fileUrl)
                .fileSizeBytes(fileResource.sizeBytes())
                .build();
    }

    public CarAssignmentDocument update(
            CarAssignmentDocument existingDocument,
            CarAssignmentDocument document,
            FileResource fileResource,
            String fileUrl
    ) {
        FileResource fileRes = fileResource == null ? FileResource.empty() : fileResource;
        return existingDocument.toBuilder()
                .carAssignmentId(document.carAssignmentId())
                .documentTypeId(document.documentTypeId())
                .fileName(fileRes.filename() != null ?
                                  fileRes.filename() :
                                  existingDocument.fileName())
                .fileUrl(fileUrl != null ? fileUrl : existingDocument.fileUrl())
                .fileSizeBytes(fileRes.sizeBytes() != null ?
                                       fileRes.sizeBytes() :
                                       existingDocument.fileSizeBytes())
                .build();
    }

}
