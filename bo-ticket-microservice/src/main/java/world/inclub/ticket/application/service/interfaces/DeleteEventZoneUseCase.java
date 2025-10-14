package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface DeleteEventZoneUseCase {
    Mono<Void> deleteById(Integer id);
}