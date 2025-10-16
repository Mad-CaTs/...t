package world.inclub.ticket.infraestructure.persistence.repository.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.DocumentType;
import world.inclub.ticket.domain.ports.DocumentTypeRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.DocumentTypeEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.R2DbcDocumentTypeRepository;

@Repository
@RequiredArgsConstructor
public class DocumentTypeRepositoryAdapter implements DocumentTypeRepositoryPort {

    private final R2DbcDocumentTypeRepository r2DbcDocumentTypeRepository;
    private final DocumentTypeEntityMapper documentTypeEntityMapper;

    @Override
    public Flux<DocumentType> findAllDocumentTypes() {
        return r2DbcDocumentTypeRepository.findAll()
                .map(documentTypeEntityMapper::toDomain);
    }

    @Override
    public Mono<DocumentType> findDocumentTypeById(Integer id) {
        return r2DbcDocumentTypeRepository.findById(id)
                .map(documentTypeEntityMapper::toDomain);
    }

}
