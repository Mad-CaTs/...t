package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PastEventResponseDto;
import world.inclub.ticket.api.dto.EventRequestDto;

import java.util.UUID;

public interface UpdatePastEventUseCase {
    Mono<PastEventResponseDto> updatePastEvent(Integer id, EventRequestDto dto, UUID updatedBy);
}