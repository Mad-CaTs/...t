package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IReasonDetailRetiroBankService;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;
import world.inclub.wallet.domain.port.IReasonDetailRetiroBankPort;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReasonDetailRetiroBankServiceImpl implements IReasonDetailRetiroBankService {
    private final IReasonDetailRetiroBankPort iReasonDetailRetiroBankPort;

    @Override
    public Mono<ReasonDetailRetiroBank> saveReasonDetailRetiroBank(ReasonDetailRetiroBank reasonDetailRetiroBank){
    return iReasonDetailRetiroBankPort.saveReasonDetailRetiroBank(reasonDetailRetiroBank);
    }
}
