package world.inclub.wallet.bankAccountWithdrawal.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AuditLogDTO;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.PagedResponse;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.AuditLogFilter;

public interface AuditLogRepositoryPort {
    Flux<AuditLogDTO> findByType(Integer type);
    Mono<Void> saveAuditLog(AuditLogDTO dto);
    Mono<PagedResponse<AuditLogDTO>> findWithFilters(AuditLogFilter filter);
}
