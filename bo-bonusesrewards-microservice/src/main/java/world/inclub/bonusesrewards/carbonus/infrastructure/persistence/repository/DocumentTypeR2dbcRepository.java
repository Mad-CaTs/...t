package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.DocumentTypeEntity;

public interface DocumentTypeR2dbcRepository
        extends R2dbcRepository<DocumentTypeEntity, Long> {

    Flux<DocumentTypeEntity> findByNameContainingIgnoreCase(String name);

    Mono<Boolean> existsByNameIgnoreCase(String name);

}