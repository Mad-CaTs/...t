package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket_package;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageHistoryRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket_package.TicketPackageHistoryMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package.TicketPackageHistoryRepository;

@Repository
@RequiredArgsConstructor
public class TicketPackageHistoryRepositoryAdapter implements TicketPackageHistoryRepositoryPort {

    private final TicketPackageHistoryRepository ticketPackageHistoryRepository;
    private final TicketPackageHistoryMapper ticketPackageHistoryMapper;

    @Override
    public Mono<TicketPackageHistory> save(TicketPackageHistory ticketPackageHistory) {
        return ticketPackageHistoryRepository.save(TicketPackageHistoryMapper.toEntity(ticketPackageHistory))
                .map(TicketPackageHistoryMapper::toDomain);
    }

    @Override
    public Flux<TicketPackageHistory> findByTicketPackageId(Long ticketPackageId) {
        return ticketPackageHistoryRepository.findByTicketPackageIdOrderByChangedAtDesc(ticketPackageId)
                .map(TicketPackageHistoryMapper::toDomain);
    }
}