package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IReasonRetiroBankService;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;
import world.inclub.wallet.domain.port.IReasonRetiroBankPort;
@Service
@RequiredArgsConstructor
public class ReasonRetiroBankServiceImpl implements IReasonRetiroBankService {
    private final IReasonRetiroBankPort iReasonRetiroBankPort;

    public Flux<ReasonRetiroBank> getAllReasonRetiroBank(){
    return iReasonRetiroBankPort.getAllReasonRetiroBank();
    }
    public Mono<ReasonRetiroBank> getIdReasonRetiroBank(long idReasonRetiroBank){
        return iReasonRetiroBankPort.getIdReasonRetiroBank(idReasonRetiroBank);
    }
}
