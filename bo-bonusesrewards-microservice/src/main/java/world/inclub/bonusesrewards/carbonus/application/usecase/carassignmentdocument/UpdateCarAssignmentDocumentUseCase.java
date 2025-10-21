package world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

import java.util.UUID;

public interface UpdateCarAssignmentDocumentUseCase {
    Mono<CarAssignmentDocument> update(UUID id, CarAssignmentDocument document, FileResource fileResource);
}