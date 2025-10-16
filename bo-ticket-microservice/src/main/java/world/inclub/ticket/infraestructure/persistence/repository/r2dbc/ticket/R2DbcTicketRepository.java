package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket;

import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketEntity;

import java.util.Collection;
import java.util.UUID;

public interface R2DbcTicketRepository extends R2dbcRepository<TicketEntity, Long> {

    Mono<TicketEntity> findByTicketUuid(UUID ticketUuid);

    Flux<TicketEntity> findByTicketUuidIn(Collection<UUID> ticketUuids);

    /**
     * Obtiene todos los tickets de un pago específico
     */
    Flux<TicketEntity> findByPaymentId(Long paymentId);

    Flux<TicketEntity> findByPaymentId(Long paymentId, Pageable pageable);

    Flux<TicketEntity> findByPaymentIdIn(Collection<Long> paymentIds);

    Flux<TicketEntity> findTicketEntitiesByEventIdAndStatus(Long eventId, TicketStatus status, Pageable pageable);

    Mono<Long> countByEventIdAndStatus(Long eventId, TicketStatus status);

    @Query("""
                SELECT *
                FROM tickets
                WHERE nomination_status_id = :nominationStatusId
                  AND payment_id IN(:paymentIds)
            """)
    Flux<TicketEntity> findByNominationStatusIdAndPaymentIdIn(@Param("nominationStatusId") Long nominationStatusId,
                                                              @Param("paymentIds") Collection<Long> paymentIds);

}