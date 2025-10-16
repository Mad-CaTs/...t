package world.inclub.ticket.application.service.interfaces.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;

public interface TicketPackageHistoryService {
    Flux<TicketPackageHistory> getHistoryByPackageId(Integer packageId);
}
