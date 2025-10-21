package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.wallet.application.service.interfaces.BankWithdrawalStatusService;
import world.inclub.wallet.domain.port.BankWithdrawalStatusPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class BankWithdrawalStatusServiceImpl implements BankWithdrawalStatusService {

    private final BankWithdrawalStatusPort bankWithdrawalStatusPort;

    @Override
    public Flux<BankWithdrawalStatusDto> findAll() {
        return bankWithdrawalStatusPort.findAll();
    }
}
