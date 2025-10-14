package world.inclub.ticket.application.service.interfaces.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedEventTicketPackageResponse;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageRequest;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageResponse;

public interface TicketPackageService {
    Mono<TicketPackage> create(TicketPackage ticketPackage);
    Mono<TicketPackage> update(Long id, TicketPackage ticketPackage);
    Mono<Void> delete(Long id);
    Mono<TicketPackage> findById(Long id);
    Flux<TicketPackage> findAll();
    Mono<TicketPackageResponse> createTicketPackage(TicketPackageRequest request);
    Mono<TicketPackageResponse> updateTicketPackage(Long id, TicketPackageRequest request);
    Flux<TicketPackageResponse> getAllTicketPackages();
    Mono<TicketPackageResponse> getTicketPackageById(Long id);
    Mono<Void> deleteTicketPackage(Long id);
    Mono<PaginatedEventTicketPackageResponse> getPackagesGroupedByEvent(int page, int size);

}
