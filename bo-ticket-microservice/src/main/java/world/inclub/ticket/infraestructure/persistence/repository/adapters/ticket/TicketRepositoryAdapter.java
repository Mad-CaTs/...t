package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketEntity;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket.TicketEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket.R2DbcTicketRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TicketRepositoryAdapter implements TicketRepositoryPort {

    private final R2DbcTicketRepository ticketRepository;
    private final TicketEntityMapper ticketEntityMapper;

    @Override
    public Flux<Ticket> saveAll(Collection<Ticket> tickets) {
        List<TicketEntity> ticketEntities = tickets.stream()
                .map(ticketEntityMapper::toEntity)
                .toList();
        return ticketRepository.saveAll(ticketEntities)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Mono<Ticket> save(Ticket ticket) {
        return ticketRepository.save(ticketEntityMapper.toEntity(ticket))
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Mono<Ticket> findByUuid(UUID ticketUuid) {
        return ticketRepository.findByTicketUuid(ticketUuid)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Flux<Ticket> findByTicketUuidIn(Collection<UUID> ticketUuids) {
        return ticketRepository.findByTicketUuidIn(ticketUuids)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Flux<Ticket> findByPaymentId(Long paymentId) {
        return ticketRepository.findByPaymentId(paymentId)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Flux<Ticket> findByPaymentId(Long paymentId, Pageable pageable) {
        return ticketRepository.findByPaymentId(paymentId, pageable)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Flux<Ticket> findByPaymentIdIn(Collection<Long> paymentIds) {
        return ticketRepository.findByPaymentIdIn(paymentIds)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Flux<Ticket> findTicketByEventIdAndStatus(Long eventId, TicketStatus status, Pageable pageable) {
        return ticketRepository.findTicketEntitiesByEventIdAndStatus(eventId, status, pageable)
                .map(ticketEntityMapper::toDomain);
    }

    @Override
    public Mono<Long> countByEventIdAndStatus(Long eventId, TicketStatus status) {
        return ticketRepository.countByEventIdAndStatus(eventId, status);
    }

    @Override
    public Flux<Ticket> getByNominationStatusIdAndPaymentIdIn(Long nominationStatusId, Collection<Long> paymentIds) {
        return ticketRepository.findByNominationStatusIdAndPaymentIdIn(nominationStatusId, paymentIds)
                .map(ticketEntityMapper::toDomain);
    }

}
