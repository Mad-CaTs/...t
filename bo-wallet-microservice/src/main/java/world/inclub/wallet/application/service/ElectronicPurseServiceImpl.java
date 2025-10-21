package world.inclub.wallet.application.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IElectronicPurseService;
import world.inclub.wallet.domain.entity.ElectronicPurse;
import world.inclub.wallet.domain.port.IElectronicPursePort;

@Service
@RequiredArgsConstructor
public class ElectronicPurseServiceImpl implements IElectronicPurseService {
    
    private final IElectronicPursePort iElectronicPursePort;
    
    @Override
    public Flux<ElectronicPurse> getElectronicPurseByIdUser(Integer idUser) {
        return iElectronicPursePort.getElectronicPurseByIdUser(idUser);
    }

    @Override
    public Mono<ElectronicPurse> saveElectronicPurse(ElectronicPurse electronicPurse) {
        return iElectronicPursePort.saveElectronicPurse(electronicPurse);
    }

}
