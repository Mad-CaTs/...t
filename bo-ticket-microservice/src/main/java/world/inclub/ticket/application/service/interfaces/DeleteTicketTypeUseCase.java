package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface DeleteTicketTypeUseCase {
    Mono<Void> deleteById(Integer id);
}
