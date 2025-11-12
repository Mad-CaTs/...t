package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PackageDetailUpdatedEventDto;
import world.inclub.transfer.liquidation.domain.entity.Membership;

public interface IMembershipService {

    Flux<Membership> getAllMemberships(); 
    //  Devuelve todas las membresías en un flujo (0..N)

    Mono<Membership> updateMembership(Membership membership); 
    // Actualiza una membresía existente y devuelve la actualizada

    Mono<Membership> transferMembershipToChild(Integer parentId, Integer childId, Integer idMembership);
    // ransfiere una membresía desde un socio padre a un hijo

    Mono<Void> updateMembershipPointsByPackage(PackageDetailUpdatedEventDto packageDetailUpdatedEvent);
    // Actualiza los puntos de una membresía según un evento de paquete

    Mono<Membership> saveMembership(Membership membership);
    // Guarda una nueva membresía y la devuelve

    Mono<Membership> getMembershipById(Integer id);
    // Busca una membresía por su ID, devuelve vacío si no existe

    Flux<Membership> getMembershipsByUserId(Integer userId);
    // Devuelve todas las membresías asociadas a un usuario
}
