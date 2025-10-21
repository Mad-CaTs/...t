package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;

public interface BankWithdrawalStatusPort {
    Flux<BankWithdrawalStatusDto> findAll();
}
