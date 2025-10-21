package world.inclub.wallet.bankAccountWithdrawal.infrastructure.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.PagedResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.service.AuditLogService;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AuditLogDTO;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.AuditLogFilter;
import world.inclub.wallet.domain.constant.ApiPaths;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_AUDITLOG)
public class AuditLogController {

    private final AuditLogService service;


    @GetMapping("/audit-logs")
    public Flux<AuditLogDTO> getAuditLogs(@RequestParam Integer type) {
        return service.getAuditLogsByType(type);
    }

    @PostMapping("/audit-logs/search")
    public Mono<PagedResponse<AuditLogDTO>> searchAuditLogs(@RequestBody AuditLogFilter filter) {
        return service.getAuditLogs(filter);
    }
}
