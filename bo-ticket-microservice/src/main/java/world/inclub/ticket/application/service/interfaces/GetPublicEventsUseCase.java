package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.PublicEventResponseDto;

public interface GetPublicEventsUseCase {
    Flux<PublicEventResponseDto> getPublicEvents();
}