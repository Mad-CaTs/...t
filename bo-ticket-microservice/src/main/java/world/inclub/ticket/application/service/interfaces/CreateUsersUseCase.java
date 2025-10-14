package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UsersRequestDto;
import world.inclub.ticket.api.dto.UsersResponseDto;

public interface CreateUsersUseCase {
    Mono<UsersResponseDto> create(UsersRequestDto dto);
}