package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;

public interface UserWalletDataService {
    Mono<UserWalletDataResponse> getFullWalletDataByUserId(Integer idUser);
}
