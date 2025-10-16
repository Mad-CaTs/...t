package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.LoginRequestDto;
import world.inclub.ticket.api.dto.LoginResponseDto;

public interface LoginUsersUseCase {
    Mono<LoginResponseDto> login(LoginRequestDto dto);
}