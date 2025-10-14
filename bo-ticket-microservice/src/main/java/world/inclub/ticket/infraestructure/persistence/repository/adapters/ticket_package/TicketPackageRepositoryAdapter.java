package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket_package;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.mapper.EventMapper;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageRepositoryPort;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.infraestructure.controller.dto.EventTicketPackageResponse;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedEventTicketPackageResponse;
import world.inclub.ticket.infraestructure.controller.dto.TicketPackageResponse;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket_package.EventPackageItemMapper;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket_package.TicketPackageMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package.EventPackageItemRepository;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package.TicketPackageRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class TicketPackageRepositoryAdapter implements TicketPackageRepositoryPort {

    private final TicketPackageRepository ticketPackageRepository;
    private final EventPackageItemRepository eventPackageItemRepository;
    private final EventRepository  eventRepository;
    private final TicketPackageMapper ticketPackageMapper;
    private final EventMapper eventMapper;


    public Mono<TicketPackage> save(TicketPackage ticketPackage) {
        return ticketPackageRepository.save(TicketPackageMapper.toEntity(ticketPackage))
                .map(TicketPackageMapper::toDomain);
    }
    @Override
    public Mono<TicketPackage> findById(Long id) {
        return ticketPackageRepository.findById(id)
                .map(TicketPackageMapper::toDomain);
    }

    @Override
    public Flux<TicketPackage> findAll() {
        return ticketPackageRepository.findAll()
                .map(TicketPackageMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return ticketPackageRepository.deleteById(id);
    }


    @Override
    public Mono<PaginatedEventTicketPackageResponse> getPackagesGroupedByEvent(int page, int size) {
        return ticketPackageRepository.findAll()
                .map(TicketPackageMapper::toDomain)
                .collectList()
                .flatMap(allPackages -> {
                    int totalElements = allPackages.size();
                    int totalPages = calculateTotalPages(totalElements, size);

                    List<TicketPackage> paginated = paginate(allPackages, page, size);

                    Map<Long, List<TicketPackage>> groupedByEvent =
                            paginated.stream().collect(Collectors.groupingBy(TicketPackage::getEventId));

                    List<Mono<EventTicketPackageResponse>> eventMonos = groupedByEvent.entrySet().stream()
                            .map(entry -> buildEventResponse(entry.getKey(), entry.getValue()))
                            .toList();

                    return Flux.mergeSequential(eventMonos)
                            .collectList()
                            .map(eventResponses -> PaginatedEventTicketPackageResponse.builder()
                                    .events(eventResponses)
                                    .currentPage(page)
                                    .pageSize(size)
                                    .totalElements(totalElements)
                                    .totalPages(totalPages)
                                    .build());
                });
    }


    private int calculateTotalPages(int totalElements, int size) {
        return (int) Math.ceil((double) totalElements / size);
    }

    private List<TicketPackage> paginate(List<TicketPackage> list, int page, int size) {
        return list.stream()
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    private Mono<EventTicketPackageResponse> buildEventResponse(Long eventId, List<TicketPackage> packages) {
        int eventPageSize = 5;
        int eventTotalElements = packages.size();
        int eventTotalPages = calculateTotalPages(eventTotalElements, eventPageSize);

        Mono<String> eventNameMono = eventRepository.findEventNameById(eventId.intValue());

        List<Mono<TicketPackageResponse>> packageResponsesMono = packages.stream()
                .limit(eventPageSize)
                .map(pkg -> eventPackageItemRepository.findByTicketPackageId(pkg.getId())
                        .map(EventPackageItemMapper::toDomain)
                        .collectList()
                        .map(items -> TicketPackageResponse.fromDomain(pkg, items)))
                .toList();

        return Mono.zip(eventNameMono, Flux.mergeSequential(packageResponsesMono).collectList())
                .map(tuple -> EventTicketPackageResponse.builder()
                        .eventId(eventId)
                        .eventName(tuple.getT1())
                        .countPackages((long) packages.size())
                        .packages(tuple.getT2())
                        .currentPage(0)
                        .pageSize(eventPageSize)
                        .totalElements(eventTotalElements)
                        .totalPages(eventTotalPages)
                        .build());
    }

}