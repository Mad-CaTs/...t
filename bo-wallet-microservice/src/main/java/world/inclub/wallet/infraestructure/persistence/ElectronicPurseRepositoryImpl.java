package world.inclub.wallet.infraestructure.persistence;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ElectronicPurse;
import world.inclub.wallet.domain.port.IElectronicPursePort;
import world.inclub.wallet.infraestructure.repository.IElectronicPurseRepository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ElectronicPurseRepositoryImpl implements IElectronicPursePort{

    private final IElectronicPurseRepository iElectronicPurseRepository;

    @Override
    public Mono<ElectronicPurse> getElectronicPurseById(Long idElectronicPurse) {
        return iElectronicPurseRepository.findById(idElectronicPurse).onErrorResume(DataIntegrityViolationException.class, ex -> {
            log.error("Database integrity violation while fetching ElectronicPurse id {}: {}", idElectronicPurse, ex.getMessage());
            return Mono.error(new DataIntegrityViolationException("Database integrity violation", ex));
        });
    }

    @Override
    public Flux<ElectronicPurse> getElectronicPurseByIdUser(Integer idUser) {
        return iElectronicPurseRepository.findByIdUser(idUser);
    }

    @Override
    public Mono<ElectronicPurse> saveElectronicPurse(ElectronicPurse electronicPurse) {
        return iElectronicPurseRepository.save(electronicPurse);
    }

    

}


