package world.inclub.ticket.application.service.ticket_package;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.ticket_package.TicketPackageHistoryService;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageHistoryRepositoryPort;

@Service
@RequiredArgsConstructor
public class TicketPackageHistoryServiceImpl implements TicketPackageHistoryService {

    private final TicketPackageHistoryRepositoryPort historyPort;


    @Override
    public Flux<TicketPackageHistory> getHistoryByPackageId(Integer packageId) {
        return historyPort.findByTicketPackageId(Long.valueOf(packageId));
    }
}