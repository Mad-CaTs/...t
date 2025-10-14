package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UsersResponseDto;
import world.inclub.ticket.api.dto.UpdateProfileRequestDto;

import java.util.UUID;

public interface UpdateProfileUseCase {
    Mono<UsersResponseDto> updateProfile(Integer userId, UpdateProfileRequestDto dto, UUID updatedBy);
}
