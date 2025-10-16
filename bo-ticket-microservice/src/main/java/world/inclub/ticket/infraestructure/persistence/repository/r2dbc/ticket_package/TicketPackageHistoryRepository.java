package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.infraestructure.persistence.entity.ticket_package.TicketPackageHistoryEntity;

@Repository
public interface TicketPackageHistoryRepository extends ReactiveCrudRepository<TicketPackageHistoryEntity, Long> {

    Flux<TicketPackageHistoryEntity> findByTicketPackageIdOrderByChangedAtDesc(Long ticketPackageId);
}