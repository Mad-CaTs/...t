package world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;

public interface GetDocumentTypesByIdUseCase {

    Mono<DocumentType> getById(Long id);

}