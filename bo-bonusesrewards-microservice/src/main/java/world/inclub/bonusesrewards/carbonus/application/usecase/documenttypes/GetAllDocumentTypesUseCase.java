package world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;

public interface GetAllDocumentTypesUseCase {

    Flux<DocumentType> getAll();

}