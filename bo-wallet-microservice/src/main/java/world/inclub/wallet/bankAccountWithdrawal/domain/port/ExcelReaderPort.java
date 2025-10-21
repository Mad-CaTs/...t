package world.inclub.wallet.bankAccountWithdrawal.domain.port;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.BankAccount;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.serviceagent.dtos.AccountBankRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;

import java.util.List;

public interface ExcelReaderPort {
    Mono<List<BankAccount>> readExcel(FilePart filePart);
    Mono<List<AccountBankByClientResponse>> searchAccounts(AccountBankRequestDTO request);
    Mono<List<SolicitudeBankDto>> getPendingAccounts(SolicitudeBankFilterDto filter);
    Mono<Boolean> updateBankStatuses(List<Long> ids, Integer estado);
}