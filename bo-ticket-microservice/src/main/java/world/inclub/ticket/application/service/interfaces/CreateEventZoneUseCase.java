package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventZoneRequestDto;
import world.inclub.ticket.api.dto.EventZoneResponseDto;

public interface CreateEventZoneUseCase {
    Mono<EventZoneResponseDto> create(EventZoneRequestDto dto);
}