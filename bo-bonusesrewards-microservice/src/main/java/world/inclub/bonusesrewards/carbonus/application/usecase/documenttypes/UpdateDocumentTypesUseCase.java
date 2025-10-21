package world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;

public interface UpdateDocumentTypesUseCase {

    Mono<DocumentType> update(Long id, DocumentType documentType);

}