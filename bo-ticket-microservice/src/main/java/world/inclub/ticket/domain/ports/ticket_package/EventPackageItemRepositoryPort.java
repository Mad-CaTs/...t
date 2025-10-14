package world.inclub.ticket.domain.ports.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;

public interface EventPackageItemRepositoryPort {
    Mono<EventPackageItem> save(EventPackageItem item);
    Flux<EventPackageItem> findByTicketPackageId(Long ticketPackageId);
    Mono<Void> deleteById(Long id);
}