package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.EventResponseDto;

public interface GetAllEventUseCase {
    Flux<EventResponseDto> getAll();
}