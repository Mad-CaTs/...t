package world.inclub.wallet.bankAccountWithdrawal.application.usecase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.PagedResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.service.AuditLogService;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AuditLogDTO;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.AuditLogRepositoryPort;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.AuditLogFilter;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepositoryPort auditLogRepositoryPort;

    @Override
    public Flux<AuditLogDTO> getAuditLogsByType(Integer type) {
        return auditLogRepositoryPort.findByType(type);
    }

    @Override
    public Mono<PagedResponse<AuditLogDTO>> getAuditLogs(AuditLogFilter filter) {
        return auditLogRepositoryPort.findWithFilters(filter);
    }

    @Override
    public Mono<Void> saveType1(String username, Integer solicitudBankId, String fileName, Integer actionId) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setUserName(username);
        dto.setType(1);
        dto.setIdSolicitudBank(Optional.ofNullable(solicitudBankId).map(Long::valueOf).orElse(null));
        dto.setFileName(fileName);
        dto.setActionId(Long.valueOf(actionId));
        return auditLogRepositoryPort.saveAuditLog(dto);
    }

    @Override
    public Mono<Void> saveType2(String username, Integer solicitudBankId, String fileName, Integer actionId, Integer recordsCount, String size) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setUserName(username);
        dto.setType(2);
        dto.setIdSolicitudBank(Optional.ofNullable(solicitudBankId).map(Long::valueOf).orElse(null));
        dto.setFileName(fileName);
        dto.setActionId(Long.valueOf(actionId));
        dto.setRecordsCount(recordsCount);
        dto.setSize(size);

        return auditLogRepositoryPort.saveAuditLog(dto);
    }
}
