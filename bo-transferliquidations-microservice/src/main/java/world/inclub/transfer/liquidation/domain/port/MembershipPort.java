package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PackageDetailUpdatedEventDto;
import world.inclub.transfer.liquidation.domain.entity.Membership;

public interface MembershipPort {

    /**
     * Obtiene todos los Memberships de manera reactiva.
     */
    Flux<Membership> getAllMemberships();

    /**
     * Busca membresías por el ID del usuario.
     */
    Flux<Membership> findByUserId(Integer userId);

    /**
     * Actualiza una membresía existente.
     */
    Mono<Membership> updateMembership(Membership membership);

    /**
     * Transfiere una membresía del padre al hijo.
     */
    Mono<Membership> transferMembership(Integer parentId, Integer childId, Integer idMembership);

    /**
     * Actualiza los puntos de membresía en base a un evento de paquete.
     */
    Mono<Void> updateMembershipPointsByPackage(PackageDetailUpdatedEventDto packageDetailUpdatedEvent);

    /**
     * Persiste una nueva membresía o actualiza si ya existe.
     */
    Mono<Membership> saveMembership(Membership membership);

    /**
     * Busca una membresía por su ID (forma directa).
     */
    Mono<Membership> findMembershipById(Integer id);

    /**
     * Busca una membresía opcionalmente por su ID (ya no se usa Optional, sino Mono vacío si no existe).
     */
    Mono<Membership> findById(Integer idMembership);
}
