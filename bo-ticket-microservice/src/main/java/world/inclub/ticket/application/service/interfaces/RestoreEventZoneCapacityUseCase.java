package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

/**
 * Use case para restituir la capacidad del event zone cuando un pago es rechazado definitivamente.
 * 
 * Este use case se ejecuta cuando un pago en estado TEMPORAL_REJECTED se finaliza automáticamente
 * después del timeout de 30 minutos, restituyendo la capacidad que había sido reservada.
 */
public interface RestoreEventZoneCapacityUseCase {
    
    /**
     * Restituye la capacidad del event zone basándose en los attendees del pago.
     * 
     * @param paymentId el ID del pago rechazado
     * @return Mono<Void> que completa cuando se restituye la capacidad exitosamente
     */
    Mono<Void> restoreEventZoneCapacity(Long paymentId);
}
