package world.inclub.ticket.domain.ports.ticket;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.ticket.TicketReport;

public interface TicketReportRepositoryPort {
    Flux<TicketReport> findByEventId(Integer eventId);
}
