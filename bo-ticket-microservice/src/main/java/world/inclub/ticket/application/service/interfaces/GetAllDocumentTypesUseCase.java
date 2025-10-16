package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.DocumentType;

public interface GetAllDocumentTypesUseCase {
    Flux<DocumentType> getAllDocumentTypes();
}
