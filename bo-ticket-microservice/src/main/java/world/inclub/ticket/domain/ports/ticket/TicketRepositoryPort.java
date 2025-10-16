package world.inclub.ticket.domain.ports.ticket;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.domain.model.ticket.Ticket;

import java.util.Collection;
import java.util.UUID;

public interface TicketRepositoryPort {

    Flux<Ticket> saveAll(Collection<Ticket> tickets);

    Mono<Ticket> save(Ticket ticket);

    Mono<Ticket> findByUuid(UUID ticketUuid);

    Flux<Ticket> findByTicketUuidIn(Collection<UUID> ticketUuids);

    /**
     * Obtiene todos los tickets de un pago específico
     */
    Flux<Ticket> findByPaymentId(Long paymentId);

    Flux<Ticket> findByPaymentId(Long paymentId, Pageable pageable);

    Flux<Ticket> findByPaymentIdIn(Collection<Long> paymentIds);

    Flux<Ticket> findTicketByEventIdAndStatus(Long eventId, TicketStatus status, Pageable pageable);

    Mono<Long> countByEventIdAndStatus(Long eventId, TicketStatus status);

    Flux<Ticket> getByNominationStatusIdAndPaymentIdIn(Long nominationStatusId, Collection<Long> paymentIds);

}
