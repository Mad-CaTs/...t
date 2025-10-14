package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.AttendeeEntity;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket.AttendeeEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket.R2DbcAttendeeRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Repository
@RequiredArgsConstructor
public class AttendeeRepositoryAdapter implements AttendeeRepositoryPort {

    private final R2DbcAttendeeRepository attendeeRepository;
    private final AttendeeEntityMapper attendeeEntityMapper;

    @Override
    public Flux<Attendee> saveAll(Iterable<Attendee> attendees) {
        List<AttendeeEntity> entities = StreamSupport.stream(attendees.spliterator(), false)
                .map(attendeeEntityMapper::toEntity)
                .collect(Collectors.toList());

        return attendeeRepository.saveAll(entities)
                .map(attendeeEntityMapper::toDomain);
    }

    @Override
    public Flux<Attendee> findByPaymentId(Long paymentId) {
        return attendeeRepository.findByPaymentId(paymentId)
                .map(attendeeEntityMapper::toDomain);
    }

    @Override
    public Mono<Attendee> findById(Long attendeeId) {
        return attendeeRepository.findById(attendeeId)
                .map(attendeeEntityMapper::toDomain);
    }

    @Override
    public Flux<Attendee> findAttendeesByIdIn(Collection<Long> attendeeIds) {
        return attendeeRepository.findAttendeeEntitiesByIdIn(attendeeIds)
                .map(attendeeEntityMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteAllByPaymentId(Long paymentId) {
        return attendeeRepository.deleteAllByPaymentId(paymentId);
    }

}
