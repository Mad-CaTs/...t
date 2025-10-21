package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes.*;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;
import world.inclub.bonusesrewards.carbonus.domain.port.DocumentTypeRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.BusinessRuleException;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class DocumentTypesService
        implements GetAllDocumentTypesUseCase,
                   GetDocumentTypesByNameUseCase,
                   GetDocumentTypesByIdUseCase,
                   CreateDocumentTypesUseCase,
                   UpdateDocumentTypesUseCase,
                   DeleteDocumentTypesUseCase {

    private final DocumentTypeRepositoryPort documentTypeRepositoryPort;

    @Override
    public Flux<DocumentType> getAll() {
        return documentTypeRepositoryPort.findAll()
                .switchIfEmpty(Flux.error(new EntityNotFoundException("No document types found")));
    }

    @Override
    public Flux<DocumentType> getByName(String name) {
        return documentTypeRepositoryPort.findByName(name);
    }

    @Override
    public Mono<DocumentType> getById(Long id) {
        return documentTypeRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Document type not found with id: " + id)));
    }

    @Override
    public Mono<DocumentType> create(DocumentType documentType) {
        return validateUniqueName(documentType.name())
                .then(documentTypeRepositoryPort.save(documentType));
    }

    @Override
    public Mono<DocumentType> update(Long id, DocumentType documentType) {
        return documentTypeRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Document type not found with id: " + id)))
                .then(validateUniqueName(documentType.name()))
                .then(documentTypeRepositoryPort.save(new DocumentType(id, documentType.name())));
    }


    @Override
    public Mono<Void> delete(Long id) {
        return documentTypeRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Document type not found with id: " + id)))
                .flatMap(existing -> documentTypeRepositoryPort.deleteById(id));
    }

    private Mono<Void> validateUniqueName(String name) {
        return documentTypeRepositoryPort.existsByName(name)
                .flatMap(exists -> exists
                        ? Mono.error(
                        new BusinessRuleException("Document type with name '" + name + "' already exists"))
                        : Mono.empty());
    }

}