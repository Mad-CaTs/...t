package world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes;

import reactor.core.publisher.Mono;

public interface DeleteDocumentTypesUseCase {

    Mono<Void> delete(Long id);

}