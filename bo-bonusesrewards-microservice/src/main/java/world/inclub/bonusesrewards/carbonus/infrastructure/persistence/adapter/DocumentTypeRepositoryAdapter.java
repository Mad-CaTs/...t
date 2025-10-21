package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;
import world.inclub.bonusesrewards.carbonus.domain.port.DocumentTypeRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.DocumentTypeEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.DocumentTypeEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.DocumentTypeR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class DocumentTypeRepositoryAdapter
        implements DocumentTypeRepositoryPort {

    private final DocumentTypeR2dbcRepository documentTypeR2DbcRepository;
    private final DocumentTypeEntityMapper documentTypeEntityMapper;

    @Override
    public Flux<DocumentType> findAll() {
        return documentTypeR2DbcRepository.findAll()
                .map(documentTypeEntityMapper::toDomain);
    }

    @Override
    public Flux<DocumentType> findByName(String name) {
        return documentTypeR2DbcRepository.findByNameContainingIgnoreCase(name)
                .map(documentTypeEntityMapper::toDomain);
    }

    @Override
    public Mono<DocumentType> findById(Long id) {
        return documentTypeR2DbcRepository.findById(id)
                .map(documentTypeEntityMapper::toDomain);
    }

    @Override
    public Mono<DocumentType> save(DocumentType documentType) {
        DocumentTypeEntity entity = documentTypeEntityMapper.toEntity(documentType);
        return documentTypeR2DbcRepository.save(entity)
                .map(documentTypeEntityMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return documentTypeR2DbcRepository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsByName(String name) {
        return documentTypeR2DbcRepository.existsByNameIgnoreCase(name);
    }

}