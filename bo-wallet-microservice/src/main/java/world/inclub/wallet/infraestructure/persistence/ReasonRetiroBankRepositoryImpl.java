package world.inclub.wallet.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;
import world.inclub.wallet.domain.port.IReasonRetiroBankPort;
import world.inclub.wallet.domain.port.ISolicitudeBankPort;
import world.inclub.wallet.infraestructure.repository.IReasonRetiroBankRepository;

@Repository
@RequiredArgsConstructor
public class ReasonRetiroBankRepositoryImpl implements IReasonRetiroBankPort {
    private  final IReasonRetiroBankRepository iReasonRetiroBankRepository;

    @Override
    public Flux<ReasonRetiroBank> getAllReasonRetiroBank(){
    return iReasonRetiroBankRepository.findAll();
    }
    @Override
    public Mono<ReasonRetiroBank> getIdReasonRetiroBank(long idReasonRetiroBank){
        return iReasonRetiroBankRepository.findById(idReasonRetiroBank);
    }
}
