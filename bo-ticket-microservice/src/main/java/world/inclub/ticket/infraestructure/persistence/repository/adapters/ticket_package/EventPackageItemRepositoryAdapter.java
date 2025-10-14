package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket_package;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.domain.ports.ticket_package.EventPackageItemRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket_package.EventPackageItemMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package.EventPackageItemRepository;


@Repository
@RequiredArgsConstructor
public class EventPackageItemRepositoryAdapter implements EventPackageItemRepositoryPort {

    private final EventPackageItemRepository eventPackageItemRepository;
    private final EventPackageItemMapper eventPackageItemMapper;


    @Override
    public Mono<EventPackageItem> save(EventPackageItem eventPackageItem) {
        return eventPackageItemRepository.save(EventPackageItemMapper.toEntity(eventPackageItem))
                .map(EventPackageItemMapper::toDomain);
    }

    @Override
    public Flux<EventPackageItem> findByTicketPackageId(Long ticketPackageId) {
        return eventPackageItemRepository.findByTicketPackageId(ticketPackageId)
                .map(EventPackageItemMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return eventPackageItemRepository.deleteById(id);
    }

}