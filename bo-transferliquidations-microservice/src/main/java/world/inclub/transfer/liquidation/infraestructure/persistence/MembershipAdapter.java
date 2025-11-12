package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import java.util.Map;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PackageDetailUpdatedEventDto;
import world.inclub.transfer.liquidation.domain.entity.Membership;
import world.inclub.transfer.liquidation.domain.port.MembershipPort;

@Component
@Slf4j
public class MembershipAdapter implements MembershipPort {

    private final ReactiveMongoTemplate reactiveMongoTemplate;

    public MembershipAdapter(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
    }

    @Override
    public Flux<Membership> getAllMemberships() {
        log.info("Buscando todos los registros de Membership");
        return reactiveMongoTemplate.findAll(Membership.class);
    }

    @Override
    public Mono<Membership> findMembershipById(Integer id) {
        log.info("Buscando Membership por id (campo de negocio): {}", id);
        Query query = Query.query(Criteria.where("id").is(id));
        return reactiveMongoTemplate.findOne(query, Membership.class);
    }

    @Override
    public Mono<Membership> updateMembership(Membership membership) {
        log.info("Actualizando Membership con id {}", membership.getId());
        Query query = Query.query(Criteria.where("id").is(membership.getId()));
        Update update = new Update().set("Membership", membership.getMembership());

        return reactiveMongoTemplate
                .updateFirst(query, update, Membership.class)
                .flatMap(result -> {
                    if (result.getModifiedCount() > 0) {
                        log.info("Membership actualizado correctamente");
                        return Mono.just(membership);
                    } else {
                        log.warn("No se encontró Membership para actualizar");
                        return Mono.empty();
                    }
                })
                .doOnError(ex -> log.error("Error al actualizar Membership", ex));
    }

    @Override
    public Mono<Membership> transferMembership(Integer parentId, Integer childId, Integer idMembership) {
        log.info("Transfiriendo membershipId {} de parentId {} a childId {}", idMembership, parentId, childId);

        Query parentQuery = Query.query(Criteria.where("id").is(parentId));

        if (parentId != null && parentId.equals(childId)) {
            log.warn("Attempt to transfer membership {} from user {} to the same user {} - skipping operation",
                    idMembership, parentId, childId);
            return reactiveMongoTemplate.findOne(parentQuery, Membership.class);
        }

        return reactiveMongoTemplate.findOne(parentQuery, Membership.class)
                .flatMap(fromUser -> {
                    if (fromUser.getMembership() == null) {
                        log.warn("Parent membership no tiene lista de Membership");
                        return Mono.empty();
                    }

                    var membershipToMove = fromUser.getMembership().stream()
                            .filter(m -> m.getIdMembership().equals(idMembership))
                            .findFirst();

                    if (membershipToMove.isEmpty()) {
                        log.warn("Membership no encontrado en el padre");
                        return Mono.empty();
                    }

                    Query childQuery = Query.query(Criteria.where("id").is(childId));

                    Update setChildElem = new Update()
                            .set("Membership.$[elem].idMembership", idMembership)
                            .filterArray(Criteria.where("elem.idPackage").is(membershipToMove.get().getIdPackage())
                                    .and("elem.idPackageDetail").is(membershipToMove.get().getIdPackageDetail()));

                    return reactiveMongoTemplate.updateFirst(childQuery, setChildElem, Membership.class)
                            .flatMap(updateResult -> {
                                if (updateResult.getModifiedCount() > 0) {
                                    log.info("idMembership {} asignado al hijo {} en el package {}/{} (update)",
                                            idMembership, childId,
                                            membershipToMove.get().getIdPackage(),
                                            membershipToMove.get().getIdPackageDetail());
                                    // ahora eliminar del padre
                                    Update removeUpdate = new Update().pull("Membership",
                                            Map.of("idMembership", idMembership));
                                    return reactiveMongoTemplate
                                            .updateFirst(parentQuery, removeUpdate, Membership.class)
                                            .then(reactiveMongoTemplate.findOne(childQuery, Membership.class));
                                }

                                // no se actualizó nada en el hijo: verificar si el documento hijo existe
                                return reactiveMongoTemplate.exists(childQuery, Membership.class)
                                        .flatMap(childExists -> {
                                            if (childExists) {
                                                // intentar añadir el paquete completo al hijo usando addToSet para
                                                // evitar duplicados exactos
                                                Update addToSet = new Update().addToSet("Membership",
                                                        membershipToMove.get());
                                                return reactiveMongoTemplate
                                                        .updateFirst(childQuery, addToSet, Membership.class)
                                                        .flatMap(addRes -> {
                                                            if (addRes.getModifiedCount() > 0) {
                                                                log.info(
                                                                        "Package añadido a hijo {} vía addToSet para idMembership {}",
                                                                        childId, idMembership);
                                                            } else {
                                                                log.warn(
                                                                        "addToSet no añadió el package al hijo {} (posible duplicado ya existente)",
                                                                        childId);
                                                            }
                                                            Update removeUpdate = new Update().pull("Membership",
                                                                    Map.of("idMembership", idMembership));
                                                            return reactiveMongoTemplate
                                                                    .updateFirst(parentQuery, removeUpdate,
                                                                            Membership.class)
                                                                    .then(reactiveMongoTemplate.findOne(childQuery,
                                                                            Membership.class));
                                                        });
                                            } else {
                                                Update renameOwner = new Update().set("id", childId);
                                                return reactiveMongoTemplate
                                                        .updateFirst(parentQuery, renameOwner, Membership.class)
                                                        .flatMap(renameRes -> {
                                                            if (renameRes.getModifiedCount() > 0) {
                                                                log.info("Documento de membership movido: id {} -> {}",
                                                                        parentId, childId);
                                                            } else {
                                                                log.warn(
                                                                        "No se pudo renombrar el documento del padre {} a {}",
                                                                        parentId, childId);
                                                            }
                                                            // devolver el documento ahora con id=childId
                                                            return reactiveMongoTemplate.findOne(childQuery,
                                                                    Membership.class);
                                                        });
                                            }
                                        });
                            });
                })
                .doOnError(ex -> log.error("Error transfiriendo Membership", ex));
    }

    @Override
    public Mono<Void> updateMembershipPointsByPackage(PackageDetailUpdatedEventDto event) {
        log.info("Actualizando puntos de Membership para paquete {}", event.idPackage());

        Query query = Query.query(
                Criteria.where("Membership")
                        .elemMatch(Criteria.where("idPackage").is(event.idPackage())
                                .and("idPackageDetail").is(event.idPackageDetail())));

        Update update = new Update()
                .set("Membership.$[elem].points", event.updatedPoints())
                .set("Membership.$[elem].pointsByFee", event.updatedPointsByFee())
                .filterArray(
                        Criteria.where("elem.idPackage").is(event.idPackage())
                                .and("elem.idPackageDetail").is(event.idPackageDetail()));

        return reactiveMongoTemplate.updateMulti(query, update, Membership.class)
                .doOnNext(r -> log.info("Documentos modificados: {}", r.getModifiedCount()))
                .then();
    }

    @Override
    public Mono<Membership> saveMembership(Membership membership) {
        log.info("Guardando Membership con id {}", membership.getId());
        return reactiveMongoTemplate.save(membership)
                .doOnSuccess(m -> log.info("Membership guardado correctamente"))
                .doOnError(ex -> log.error("Error al guardar Membership", ex));
    }

    @Override
    public Mono<Membership> findById(Integer idMembership) {
        log.info("Buscando Membership (campo id): {}", idMembership);
        Query query = Query.query(Criteria.where("id").is(idMembership));
        return reactiveMongoTemplate.findOne(query, Membership.class);
    }

    @Override
    public Flux<Membership> findByUserId(Integer userId) {
        log.info("Buscando Memberships para userId {}", userId);
        Query query = Query.query(Criteria.where("id").is(userId));
        return reactiveMongoTemplate.find(query, Membership.class);
    }
}
