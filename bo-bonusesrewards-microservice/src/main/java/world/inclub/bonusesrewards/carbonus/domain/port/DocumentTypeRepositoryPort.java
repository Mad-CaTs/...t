package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;

public interface DocumentTypeRepositoryPort {

    Flux<DocumentType> findAll();

    Flux<DocumentType> findByName(String name);

    Mono<DocumentType> findById(Long id);

    Mono<DocumentType> save(DocumentType documentType);

    Mono<Void> deleteById(Long id);

    Mono<Boolean> existsByName(String name);

}