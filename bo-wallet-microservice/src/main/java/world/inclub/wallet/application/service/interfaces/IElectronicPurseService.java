package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ElectronicPurse;

public interface IElectronicPurseService {

    public Flux<ElectronicPurse> getElectronicPurseByIdUser(Integer idUser);

    public Mono<ElectronicPurse> saveElectronicPurse(ElectronicPurse electronicPurse);

}
