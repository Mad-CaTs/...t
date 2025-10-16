package world.inclub.ticket.application.port.ticket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.TicketWithAttendeeResponse;
import world.inclub.ticket.domain.enums.TicketStatus;

public interface TicketService {

    Mono<Page<TicketWithAttendeeResponse>> getTicketsByEventId(Long eventId, TicketStatus status, Pageable pageable);

}
