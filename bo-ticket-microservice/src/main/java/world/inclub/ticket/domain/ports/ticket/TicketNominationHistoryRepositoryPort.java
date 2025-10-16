package world.inclub.ticket.domain.ports.ticket;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket.TicketNominationHistory;

import java.util.List;

public interface TicketNominationHistoryRepositoryPort {

    Mono<TicketNominationHistory> save(TicketNominationHistory history);

    Flux<TicketNominationHistory> saveAll(List<TicketNominationHistory> histories);

}
