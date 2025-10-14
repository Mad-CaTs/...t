package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventVenueRequestDto;
import world.inclub.ticket.api.dto.EventVenueResponseDto;

import java.util.UUID;

public interface UpdateEventVenueUseCase {
    Mono<EventVenueResponseDto> update(Integer id, EventVenueRequestDto dto, UUID updateBy);
}
