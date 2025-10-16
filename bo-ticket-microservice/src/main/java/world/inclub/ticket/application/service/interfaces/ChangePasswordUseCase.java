package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.ChangePasswordResponseDto;
import world.inclub.ticket.api.dto.ChangePasswordRequestDto;

import java.util.UUID;

public interface ChangePasswordUseCase {
    Mono<ChangePasswordResponseDto> changePassword(Integer userId, ChangePasswordRequestDto dto, UUID updatedBy);
}
