package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestAccountBankResponseDTO;
import world.inclub.wallet.domain.entity.WithDrawalRequestAccountBank;


public interface IWithDrawalRequestAccountBankPort {

    public Mono<WithDrawalRequestAccountBank> saveWDRAccountBank(WithDrawalRequestAccountBank request);
    public Flux<WithDrawalRequestAccountBankResponseDTO> getWDRAccountBankByIdUser(Integer idUser);

}
