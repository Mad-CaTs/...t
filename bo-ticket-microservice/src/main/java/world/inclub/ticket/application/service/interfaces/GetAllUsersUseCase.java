package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.UsersResponseDto;

public interface GetAllUsersUseCase {
    Flux<UsersResponseDto> getAll();
}