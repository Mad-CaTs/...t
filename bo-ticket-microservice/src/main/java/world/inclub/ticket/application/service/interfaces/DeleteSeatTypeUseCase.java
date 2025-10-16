package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface DeleteSeatTypeUseCase {
    Mono<Void> delete(Integer Id);
}
