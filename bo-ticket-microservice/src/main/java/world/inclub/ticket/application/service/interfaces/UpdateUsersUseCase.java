package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UsersRequestDto;
import world.inclub.ticket.api.dto.UsersResponseDto;

import java.util.UUID;

public interface UpdateUsersUseCase {
    Mono<UsersResponseDto> update(Integer id, UsersRequestDto dto, UUID updatedBy);
}