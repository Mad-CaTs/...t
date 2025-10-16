package world.inclub.ticket.application.service.ticket_package;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.ticket_package.EventPackageItemService;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.domain.ports.ticket_package.EventPackageItemRepositoryPort;

@Service
@RequiredArgsConstructor
public class EventPackageItemServiceImpl implements EventPackageItemService {

    private final EventPackageItemRepositoryPort eventPackageItemPort;


    @Override
    public Mono<EventPackageItem> createItem(EventPackageItem item) {
        return eventPackageItemPort.save(item);
    }

    @Override
    public Flux<EventPackageItem> getItemsByPackageId(Integer packageId) {
        return eventPackageItemPort.findByTicketPackageId(Long.valueOf(packageId));
    }

    @Override
    public Mono<Void> deleteItem(Integer id) {
        return eventPackageItemPort.deleteById(Long.valueOf(id));
    }
}