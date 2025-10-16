package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.AttendeeEntity;

import java.util.Collection;

public interface R2DbcAttendeeRepository extends R2dbcRepository<AttendeeEntity, Long> {

    /**
     * Busca attendees por ID de pago
     */
    Flux<AttendeeEntity> findByPaymentId(Long paymentId);

    Flux<AttendeeEntity> findAttendeeEntitiesByIdIn(Collection<Long> ids);

    Mono<Void> deleteAllByPaymentId(Long paymentId);
}