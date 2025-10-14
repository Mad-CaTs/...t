package world.inclub.ticket.domain.ports;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.DocumentType;

public interface DocumentTypeRepositoryPort {

    Flux<DocumentType> findAllDocumentTypes();

    Mono<DocumentType> findDocumentTypeById(Integer id);

}
