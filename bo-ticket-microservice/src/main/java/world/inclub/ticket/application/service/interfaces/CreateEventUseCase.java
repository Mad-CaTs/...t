package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventRequestDto;
import world.inclub.ticket.api.dto.EventResponseDto;

import java.util.UUID;

public interface CreateEventUseCase {
    Mono<EventResponseDto> create(EventRequestDto dto, UUID updatedBy);
}