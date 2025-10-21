package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestElectronicPurseResponseDTO;
import world.inclub.wallet.domain.entity.WithDrawalRequestElectronicPurse;

public interface IWithDrawalRequestElectronicPursePort {

    public Mono<WithDrawalRequestElectronicPurse> saveWDRElectrinicPurse(WithDrawalRequestElectronicPurse object);

    public Flux<WithDrawalRequestElectronicPurseResponseDTO> getWDRElectronicPurseByIdUser(Integer idUser);

}
