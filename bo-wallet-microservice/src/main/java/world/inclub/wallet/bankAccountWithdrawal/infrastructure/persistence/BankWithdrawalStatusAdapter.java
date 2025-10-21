package world.inclub.wallet.bankAccountWithdrawal.infrastructure.persistence;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.port.BankWithdrawalStatusPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;
import world.inclub.wallet.bankAccountWithdrawal.domain.repository.BankWithdrawalStatusRepository;

@Repository
@RequiredArgsConstructor
public class BankWithdrawalStatusAdapter implements BankWithdrawalStatusPort {

    private final BankWithdrawalStatusRepository bankWithdrawalStatusRepository;

    @Override
    public Flux<BankWithdrawalStatusDto> findAll() {
        return bankWithdrawalStatusRepository.findAllDto();
    }
}
