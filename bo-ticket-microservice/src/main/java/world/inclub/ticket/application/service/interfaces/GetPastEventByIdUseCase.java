package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PastEventResponseDto;

public interface GetPastEventByIdUseCase {
    Mono<PastEventResponseDto> getPastEventById(Integer id);
}