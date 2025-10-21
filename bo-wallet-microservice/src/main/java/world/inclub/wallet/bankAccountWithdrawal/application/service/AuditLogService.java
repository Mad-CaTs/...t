package world.inclub.wallet.bankAccountWithdrawal.application.service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AuditLogDTO;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.PagedResponse;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.AuditLogFilter;

public interface AuditLogService {
    Flux<AuditLogDTO> getAuditLogsByType(Integer type);
    Mono<PagedResponse<AuditLogDTO>> getAuditLogs(AuditLogFilter filter);
    Mono<Void> saveType1(String username, Integer solicitudBankId, String fileName, Integer actionId);
    Mono<Void> saveType2(String username, Integer solicitudBankId, String fileName, Integer actionId, Integer recordsCount, String size);

}
