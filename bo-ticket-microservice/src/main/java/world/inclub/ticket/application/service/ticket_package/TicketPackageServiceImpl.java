package world.inclub.ticket.application.service.ticket_package;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.ticket_package.TicketPackageService;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;
import world.inclub.ticket.domain.ports.ticket_package.EventPackageItemRepositoryPort;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageHistoryRepositoryPort;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageRepositoryPort;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedEventTicketPackageResponse;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageItemRequest;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageRequest;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageResponse;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket_package.TicketPackageMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketPackageServiceImpl implements TicketPackageService {

    private final TicketPackageRepositoryPort ticketPackageRepository;
    private final EventPackageItemRepositoryPort eventPackageItemRepository;
    private final TicketPackageHistoryRepositoryPort ticketPackageHistoryRepository;
    private final TicketPackageMapper mapper;


    @Override
    public Mono<TicketPackage> create(TicketPackage ticketPackage) {
        return ticketPackageRepository.save(ticketPackage);
    }

    @Override
    public Mono<TicketPackage> update(Long id, TicketPackage ticketPackage) {
        return ticketPackageRepository.findById(id);

    }

    @Override
    public Mono<Void> delete(Long id) {
        return ticketPackageRepository.deleteById(id);
    }

    @Override
    public Mono<TicketPackage> findById(Long id) {
        return ticketPackageRepository.findById(id);
    }

    @Override
    public Flux<TicketPackage> findAll() {
        return ticketPackageRepository.findAll();
    }

    @Override
    public Flux<TicketPackageResponse> getAllTicketPackages() {
        return ticketPackageRepository.findAll()
                .flatMap(pkg -> eventPackageItemRepository.findByTicketPackageId(pkg.getId())
                        .collectList()
                        .map(items -> TicketPackageResponse.fromDomain(pkg, items))
                );
    }

    @Override
    public Mono<TicketPackageResponse> getTicketPackageById(Long id) {
        return ticketPackageRepository.findById(id)
                .flatMap(pkg -> eventPackageItemRepository.findByTicketPackageId(pkg.getId())
                        .collectList()
                        .map(items -> TicketPackageResponse.fromDomain(pkg, items))
                );
    }

    @Override
    public Mono<Void> deleteTicketPackage(Long id) {
        return ticketPackageRepository.deleteById(id);
    }

    @Override
    public Mono<PaginatedEventTicketPackageResponse> getPackagesGroupedByEvent(int page, int size) {
        return ticketPackageRepository.getPackagesGroupedByEvent(page,size);
    }



    @Override
    public Mono<TicketPackageResponse> createTicketPackage(TicketPackageRequest request) {
        LocalDateTime now = LocalDateTime.now();
        TicketPackage ticketPackage = buildTicketPackage(request, now);

        return ticketPackageRepository.save(ticketPackage)
                .flatMap(savedPackage -> handleItemCreation(savedPackage, request.getItems().get(0))
                        .flatMap(savedItem -> registerHistory(savedPackage, "CREATED", null,
                                Map.of("message", "TicketPackage creado con 1 item").toString(),
                                now, String.valueOf(request.getChangedBy()))
                                .thenReturn(TicketPackageResponse.fromDomain(savedPackage, List.of(savedItem)))
                        )
                );
    }

    @Override
    public Mono<TicketPackageResponse> updateTicketPackage(Long id, TicketPackageRequest request) {
        LocalDateTime now = LocalDateTime.now();

        return ticketPackageRepository.findById(id)
                .flatMap(existing -> {
                    updateTicketPackageFields(existing, request, now);

                    return ticketPackageRepository.save(existing)
                            .flatMap(savedPackage ->
                                    eventPackageItemRepository.findByTicketPackageId(savedPackage.getId())
                                            .collectList()
                                            .flatMap(existingItems -> handleItemUpdate(savedPackage, existingItems, request.getItems().get(0)))
                                            .flatMap(savedItem -> registerHistory(
                                                            savedPackage,
                                                            "UPDATED",
                                                            existing.toString(),
                                                            savedPackage.toString(),
                                                            now,
                                                    String.valueOf(request.getChangedBy())
                                                    )
                                                            .thenReturn(TicketPackageResponse.fromDomain(savedPackage, List.of(savedItem)))
                                            )
                            );
                });
    }


    private TicketPackage buildTicketPackage(TicketPackageRequest request, LocalDateTime now) {
        Long currencyTypeId = request.getCurrencyTypeId() != null ? request.getCurrencyTypeId() : 2L;
        Long statusId = request.getStatusId() != null ? request.getStatusId() : 1L;

        return TicketPackage.builder()
                .eventId(request.getEventId())
                .name(request.getName())
                .description(request.getDescription())
                .currencyTypeId(currencyTypeId)
                .pricePen(request.getPricePen())
                .priceUsd(request.getPriceUsd())
                .statusId(statusId)
                .createdAt(now)
                .expirationDate(request.getExpirationDate())
                .build();
    }

    private void updateTicketPackageFields(TicketPackage existing, TicketPackageRequest request, LocalDateTime now) {
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPricePen(request.getPricePen());
        existing.setPriceUsd(request.getPriceUsd());
        existing.setExpirationDate(request.getExpirationDate());
        existing.setUpdatedAt(now);
    }

    private Mono<EventPackageItem> handleItemCreation(TicketPackage savedPackage, TicketPackageItemRequest itemReq) {
        EventPackageItem item = EventPackageItem.builder()
                .ticketPackageId(savedPackage.getId())
                .eventZoneId(itemReq.getEventZoneId())
                .quantity(itemReq.getQuantity())
                .quantityFree(itemReq.getQuantityFree())
                .build();

        return eventPackageItemRepository.save(item);
    }

    private Mono<EventPackageItem> handleItemUpdate(TicketPackage savedPackage, List<EventPackageItem> existingItems, TicketPackageItemRequest itemReq) {
        Optional<EventPackageItem> existingItemOpt = existingItems.stream()
                .filter(i -> i.getEventZoneId().equals(itemReq.getEventZoneId()))
                .findFirst();

        EventPackageItem item = existingItemOpt.map(existingItem -> {
            existingItem.setQuantity(itemReq.getQuantity());
            existingItem.setQuantityFree(itemReq.getQuantityFree());
            return existingItem;
        }).orElseGet(() -> EventPackageItem.builder()
                .ticketPackageId(savedPackage.getId())
                .eventZoneId(itemReq.getEventZoneId())
                .quantity(itemReq.getQuantity())
                .quantityFree(itemReq.getQuantityFree())
                .build());

        return eventPackageItemRepository.save(item);
    }

    private Mono<TicketPackageHistory> registerHistory(TicketPackage savedPackage, String action, String oldValue, String newValue, LocalDateTime now, String changedBy) {
        TicketPackageHistory history = TicketPackageHistory.builder()
                .ticketPackageId(savedPackage.getId())
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .changedAt(now)
                .changedBy(Long.valueOf(changedBy))
                .build();

        return ticketPackageHistoryRepository.save(history);
    }
}
