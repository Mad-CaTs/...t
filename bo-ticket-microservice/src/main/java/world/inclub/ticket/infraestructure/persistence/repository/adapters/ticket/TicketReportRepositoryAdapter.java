package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.ticket.TicketReport;
import world.inclub.ticket.domain.ports.ticket.TicketReportRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.r2dbc.ticket.R2DbcTicketReportRepository;

@Repository
@RequiredArgsConstructor
public class TicketReportRepositoryAdapter implements TicketReportRepositoryPort {

    private final R2DbcTicketReportRepository r2dbcRepo;

    @Override
    public Flux<TicketReport> findByEventId(Integer eventId) {
        return r2dbcRepo.findReportByEventId(eventId);
    }
}
