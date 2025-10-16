package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventVenueRequestDto;
import world.inclub.ticket.api.dto.EventVenueResponseDto;

import java.util.UUID;

public interface CreateEventVenueUseCase {
    Mono<EventVenueResponseDto> create(EventVenueRequestDto dto, UUID updatedBy);
}
