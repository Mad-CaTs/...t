package world.inclub.ticket.application.service.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.TicketWithAttendeeResponse;
import world.inclub.ticket.application.mapper.TicketWithAttendeeMapper;
import world.inclub.ticket.application.port.ticket.TicketService;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepositoryPort ticketRepositoryPort;
    private final AttendeeRepositoryPort attendeeRepositoryPort;
    private final TicketWithAttendeeMapper ticketWithAttendeeMapper;

    @Override
    public Mono<Page<TicketWithAttendeeResponse>> getTicketsByEventId(Long eventId, TicketStatus status, Pageable pageable) {
        Mono<Long> total = ticketRepositoryPort.countByEventIdAndStatus(eventId, status);

        Mono<List<Ticket>> ticketsListMono = ticketRepositoryPort
                .findTicketByEventIdAndStatus(eventId, status, pageable)
                .collectList();

        return ticketsListMono
                .flatMap(tickets -> {
                    List<Long> attendeeIds = tickets.stream()
                            .map(Ticket::getAttendeeId)
                            .distinct()
                            .toList();

                    return attendeeRepositoryPort.findAttendeesByIdIn(attendeeIds)
                            .collectList()
                            .zipWith(total)
                            .map(tuple -> {
                                List<Attendee> attendees = tuple.getT1();
                                Long totalCount = tuple.getT2();
                                List<TicketWithAttendeeResponse> responses = tickets.stream()
                                        .map(ticket -> {
                                            Attendee attendee = attendees.stream()
                                                    .filter(a -> a.getId().equals(ticket.getAttendeeId()))
                                                    .findFirst()
                                                    .orElse(null);
                                            return ticketWithAttendeeMapper.toResponse(ticket, Objects.requireNonNull(attendee));
                                        })
                                        .toList();
                                return new PageImpl<>(responses, pageable, totalCount);
                            });
                });
    }

}
