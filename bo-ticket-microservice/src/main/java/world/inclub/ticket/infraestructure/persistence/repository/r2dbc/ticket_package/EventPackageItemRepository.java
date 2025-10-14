package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.infraestructure.persistence.entity.ticket_package.EventPackageItemEntity;

@Repository
public interface EventPackageItemRepository extends ReactiveCrudRepository<EventPackageItemEntity, Long> {

    Flux<EventPackageItemEntity> findByTicketPackageId(Long ticketPackageId);

}
