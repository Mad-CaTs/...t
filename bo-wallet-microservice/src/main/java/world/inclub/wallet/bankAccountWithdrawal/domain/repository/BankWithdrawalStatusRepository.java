package world.inclub.wallet.bankAccountWithdrawal.domain.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.BankWithdrawalStatus;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;


public interface BankWithdrawalStatusRepository extends ReactiveCrudRepository<BankWithdrawalStatus, Long> {

    @Query("SELECT id, name, background_color, font_color FROM bo_wallet.bank_withdrawal_status")
    Flux<BankWithdrawalStatusDto> findAllDto();
}
