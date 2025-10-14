package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface DeleteUsersUseCase {
    Mono<Void> deleteById(Integer id);
}