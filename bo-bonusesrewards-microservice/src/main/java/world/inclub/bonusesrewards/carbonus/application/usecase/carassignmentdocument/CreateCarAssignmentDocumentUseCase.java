package world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

import java.util.UUID;

public interface CreateCarAssignmentDocumentUseCase {

    /**
     * Creates a new Car Assignment Document with the associated file resource.
     *
     * @param document     The CarAssignmentDocument details to be created.
     * @param fileResource The file resource associated with the document.
     * @return A Mono emitting the created CarAssignmentDocument.
     */
    Mono<CarAssignmentDocument> create(CarAssignmentDocument document, FileResource fileResource);

}