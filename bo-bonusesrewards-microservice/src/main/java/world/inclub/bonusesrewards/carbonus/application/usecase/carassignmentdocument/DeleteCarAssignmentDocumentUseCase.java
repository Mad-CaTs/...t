package world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface DeleteCarAssignmentDocumentUseCase {
    Mono<Void> deleteById(UUID id);
}