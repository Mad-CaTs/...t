package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ElectronicPurse;

public interface IElectronicPursePort {

    public Mono<ElectronicPurse> getElectronicPurseById(Long idElectronicPurse);

    public Flux<ElectronicPurse> getElectronicPurseByIdUser(Integer idUser);

    public Mono<ElectronicPurse> saveElectronicPurse(ElectronicPurse electronicPurse);

}
