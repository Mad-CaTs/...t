package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;

public interface BankWithdrawalStatusService {
    Flux<BankWithdrawalStatusDto> findAll();
}
