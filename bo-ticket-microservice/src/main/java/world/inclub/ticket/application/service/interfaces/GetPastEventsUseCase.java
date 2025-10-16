package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.PastEventResponseDto;

public interface GetPastEventsUseCase {
    Flux<PastEventResponseDto> getPastEvents();
}