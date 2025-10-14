package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.RestoreEventZoneCapacityUseCase;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementación del use case para restituir la capacidad del event zone
 * cuando un pago es rechazado definitivamente.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RestoreEventZoneCapacityService implements RestoreEventZoneCapacityUseCase {

    private final AttendeeRepositoryPort attendeeRepositoryPort;
    private final EventZoneRepository eventZoneRepository;

    @Override
    @Transactional
    public Mono<Void> restoreEventZoneCapacity(Long paymentId) {
        log.info("Starting capacity restoration for payment ID: {}", paymentId);

        return attendeeRepositoryPort.findByPaymentId(paymentId)
                .collectList()
                .flatMap(attendees -> {
                    if (attendees.isEmpty()) {
                        log.warn("No attendees found for payment ID: {}", paymentId);
                        return Mono.error(new NotFoundException("No attendees found for payment: " + paymentId));
                    }

                    log.info("Found {} attendees for payment ID: {}", attendees.size(), paymentId);

                    // Agrupar por event_zone_id y contar la cantidad de tickets por zona
                    Map<Integer, Long> zoneQuantities = attendees.stream()
                            .collect(Collectors.groupingBy(
                                    attendee -> attendee.getEventZoneId().intValue(),
                                    Collectors.counting()
                            ));

                    log.info("Capacity restoration summary for payment {}: {}", paymentId, zoneQuantities);

                    // Restituir capacidad para cada event_zone
                    return Flux.fromIterable(zoneQuantities.entrySet())
                            .flatMap(entry -> {
                                Integer eventZoneId = entry.getKey();
                                Integer quantityToRestore = entry.getValue().intValue();

                                log.info("Restoring {} tickets to event_zone {} for payment {}", 
                                        quantityToRestore, eventZoneId, paymentId);

                                return eventZoneRepository.restoreCapacity(eventZoneId, quantityToRestore)
                                        .doOnSuccess(newCapacity -> 
                                            log.info("Successfully restored {} tickets to event_zone {}. New capacity: {}", 
                                                    quantityToRestore, eventZoneId, newCapacity))
                                        .doOnError(error -> 
                                            log.error("Failed to restore capacity for event_zone {}: {}", eventZoneId, error.getMessage()));
                            })
                            .then();
                })
                .doOnSuccess(result -> log.info("Capacity restoration completed successfully for payment ID: {}", paymentId))
                .doOnError(error -> log.error("Capacity restoration failed for payment ID {}: {}", paymentId, error.getMessage()));
    }
}
