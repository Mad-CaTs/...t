package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventResponseDto;

public interface GetEventUseCase {
    Mono<EventResponseDto> getEvent(Integer id);
}