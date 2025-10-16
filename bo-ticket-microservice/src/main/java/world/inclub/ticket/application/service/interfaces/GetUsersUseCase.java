package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UsersResponseDto;

public interface GetUsersUseCase {
    Mono<UsersResponseDto> getById(Integer id);
}