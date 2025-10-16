package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UsersResponseDto;
import world.inclub.ticket.api.dto.CreateUserRequestDto;

import java.util.UUID;

public interface CreateUserUseCase {
    Mono<UsersResponseDto> createUser(CreateUserRequestDto dto, UUID createdBy);
}
