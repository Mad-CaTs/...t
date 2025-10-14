package world.inclub.ticket.domain.ports.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;

public interface TicketPackageHistoryRepositoryPort {
    Mono<TicketPackageHistory> save(TicketPackageHistory history);
    Flux<TicketPackageHistory> findByTicketPackageId(Long ticketPackageId);
}