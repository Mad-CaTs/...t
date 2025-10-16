package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PublicEventResponseDto;

public interface GetPublicEventByIdUseCase {
    Mono<PublicEventResponseDto> getPublicEventById(Integer id);
}