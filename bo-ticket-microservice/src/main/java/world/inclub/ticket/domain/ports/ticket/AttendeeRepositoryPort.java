package world.inclub.ticket.domain.ports.ticket;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket.Attendee;

import java.util.Collection;

public interface AttendeeRepositoryPort {

    Flux<Attendee> saveAll(Iterable<Attendee> attendees);
    
    /**
     * Busca attendees por ID de pago
     */
    Flux<Attendee> findByPaymentId(Long paymentId);
    
    /**
     * Busca un attendee por ID
     */
    Mono<Attendee> findById(Long attendeeId);

    Flux<Attendee> findAttendeesByIdIn(Collection<Long> attendeeIds);

    Mono<Void> deleteAllByPaymentId(Long paymentId);

}
