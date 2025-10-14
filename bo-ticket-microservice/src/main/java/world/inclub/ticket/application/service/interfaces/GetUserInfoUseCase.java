package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.UserStatusResponseDto;

public interface GetUserInfoUseCase {
    Mono<UserStatusResponseDto> getUserInfo(Integer userId);
}
