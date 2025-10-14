package world.inclub.ticket.domain.ports.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedEventTicketPackageResponse;

public interface TicketPackageRepositoryPort {
    Mono<TicketPackage> save(TicketPackage ticketPackage);
    Mono<TicketPackage> findById(Long id);
    Flux<TicketPackage> findAll();
    Mono<Void> deleteById(Long id);
    Mono<PaginatedEventTicketPackageResponse> getPackagesGroupedByEvent(int page, int size);
}
