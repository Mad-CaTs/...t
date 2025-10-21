package world.inclub.wallet.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;
import world.inclub.wallet.domain.port.IReasonDetailRetiroBankPort;

@Repository
@RequiredArgsConstructor
public class ReasonDetailRetiroBankRepositoryImpl implements IReasonDetailRetiroBankPort {
    private final IReasonDetailRetiroBankRepository iReasonDetailRetiroBankRepository;

    @Override
    public Mono<ReasonDetailRetiroBank> saveReasonDetailRetiroBank(ReasonDetailRetiroBank reasonDetailRetiroBank){
        return iReasonDetailRetiroBankRepository.save(reasonDetailRetiroBank);
    }

}
