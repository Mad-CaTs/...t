package world.inclub.ticket.application.service.interfaces.ticket_package;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;

public interface EventPackageItemService {
    Mono<EventPackageItem> createItem(EventPackageItem item);
    Flux<EventPackageItem> getItemsByPackageId(Integer packageId);
    Mono<Void> deleteItem(Integer id);
}