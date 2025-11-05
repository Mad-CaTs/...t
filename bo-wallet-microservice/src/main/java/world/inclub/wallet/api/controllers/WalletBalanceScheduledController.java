package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.WalletBalanceScheduledServiceImpl;
import world.inclub.wallet.domain.constant.ApiPaths;

@Slf4j
@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_WALLETBALANCESCHEDULED)
@RequiredArgsConstructor
public class WalletBalanceScheduledController {

    private final WalletBalanceScheduledServiceImpl reconciliationService;

    @PostMapping("/execute-manual")
    public Mono<ResponseEntity<String>> executeManualReconciliation() {
        log.info("Solicitud de ejecución manual de reconciliación recibida");

        return reconciliationService.reconcileAllWallets()
                .map(result -> ResponseEntity.ok(
                        String.format("Reconciliación completada: %d procesados, %d actualizados, %d errores",
                                result.getTotalProcessed(),
                                result.getTotalUpdated(),
                                result.getTotalErrors())
                ))
                .onErrorResume(error -> {
                    log.error("Error ejecutando reconciliación: {}", error.getMessage(), error);
                    return Mono.just(ResponseEntity.internalServerError()
                            .body("Error: " + error.getMessage()));
                });
    }
}
