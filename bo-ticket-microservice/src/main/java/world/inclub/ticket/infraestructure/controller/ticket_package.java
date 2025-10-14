package world.inclub.ticket.infraestructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.ticket_package.EventPackageItemService;
import world.inclub.ticket.application.service.interfaces.ticket_package.TicketPackageHistoryService;
import world.inclub.ticket.application.service.interfaces.ticket_package.TicketPackageService;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedEventTicketPackageResponse;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageRequest;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket-packages")
public class ticket_package {

    private final TicketPackageService service;
    private final EventPackageItemService itemService;
    private final TicketPackageHistoryService historyService;

    @GetMapping
    public Flux<TicketPackage> getAll() {
        return service.findAll();
    }

    // ========== History ==========
    @GetMapping("/{packageId}/history")
    public Flux<TicketPackageHistory> getHistory(@PathVariable Integer packageId) {
        return historyService.getHistoryByPackageId(packageId);
    }

    // ========= Service =============

    @PostMapping ("/create")
    public Mono<TicketPackageResponse> create(@RequestBody TicketPackageRequest request) {
        return service.createTicketPackage(request);
    }

    @PutMapping("/{id}")
    public Mono<TicketPackageResponse> update(@PathVariable Long id,
                                              @RequestBody TicketPackageRequest request) {
        return service.updateTicketPackage(id, request);
    }


    @GetMapping("detailpackage/{id}")
    public Mono<TicketPackageResponse> getByIds(@PathVariable Long id) {
        return service.getTicketPackageById(id);
    }

    @DeleteMapping("detailpackage/{id}")
    public Mono<Void> deletess(@PathVariable Long id) {
        return service.deleteTicketPackage(id);
    }

    @GetMapping("/grouped")
    public Mono<ResponseEntity<PaginatedEventTicketPackageResponse>> getGrouped(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getPackagesGroupedByEvent(page, size)
                .map(ResponseEntity::ok);
    }
}