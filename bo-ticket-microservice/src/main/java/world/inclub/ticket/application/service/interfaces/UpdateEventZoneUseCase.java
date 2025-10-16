package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventZoneRequestDto;
import world.inclub.ticket.api.dto.EventZoneResponseDto;

public interface UpdateEventZoneUseCase {
    Mono<EventZoneResponseDto> update(Integer id, EventZoneRequestDto dto);
}