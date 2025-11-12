package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Three;
import world.inclub.transfer.liquidation.domain.port.IThreePort;

@Component
@RequiredArgsConstructor
@Slf4j
public class ThreeAdapter implements IThreePort {

    private final ReactiveMongoTemplate reactiveMongoTemplate;

    public Mono<Three> findRegaliasByIdMaster(Integer id) {
        log.debug("Buscando en TreeRegalias: {}", id);
        Query query = Query.query(Criteria.where("idsociomaster").is(id));
    return reactiveMongoTemplate.findOne(query, Three.class)
        .doOnNext(tree -> log.debug("TreeRegalias(id={}) encontrado: {} nodos", id, tree != null && tree.getData() != null ? tree.getData().size() : 0))
        .switchIfEmpty(Mono.defer(() -> {
            log.debug("No se encontró documento en TreeRegalias para idsociomaster={}", id);
            return Mono.empty();
        }))
        .doOnError(ex -> log.error("Error consultando TreeRegalias por id", ex));
    }

    public Mono<Three> findSponsorByIdMaster(Integer id) {
        log.debug("Buscando en TreeSponsor: {}", id);
        Query query = Query.query(Criteria.where("idsociomaster").is(id));
    return reactiveMongoTemplate.findOne(query, Three.class, "TreeSponsor")
        .doOnNext(tree -> log.debug("TreeSponsor(id={}) encontrado: {} nodos", id, tree != null && tree.getData() != null ? tree.getData().size() : 0))
        .switchIfEmpty(Mono.defer(() -> {
            log.debug("No se encontró documento en TreeSponsor para idsociomaster={}", id);
            return Mono.empty();
        }))
        .doOnError(ex -> log.error("Error consultando TreeSponsor por id", ex));
    }

    @Override
    public Flux<Three> findAllSponsorTrees() {
        log.debug("Listando todos los documentos en TreeSponsor");
        return reactiveMongoTemplate.find(new Query(), Three.class, "TreeSponsor");
    }

    public Mono<Three> updateThree(Three tree) {
        log.debug("Modificando TreeRegalias para idsociomaster={}", tree.getIdsociomaster());
        Query query = Query.query(Criteria.where("idsociomaster").is(tree.getIdsociomaster()));
        Update update = new Update().set("data", tree.getData());
        return reactiveMongoTemplate.updateFirst(query, update, Three.class)
                .doOnNext(result -> log.debug("Modificados: {}", result.getModifiedCount()))
                .map(res -> tree);
    }

    public Mono<Three> updateThreePatrocinio(Three tree) {
        log.debug("Modificando TreeSponsor para idsociomaster={}", tree.getIdsociomaster());
        Query query = Query.query(Criteria.where("idsociomaster").is(tree.getIdsociomaster()));
        Update update = new Update().set("data", tree.getData());
        return reactiveMongoTemplate.updateFirst(query, update, Three.class, "TreeSponsor")
                .doOnNext(result -> log.debug("Modificados: {}", result.getModifiedCount()))
                .map(res -> tree);
    }
}

