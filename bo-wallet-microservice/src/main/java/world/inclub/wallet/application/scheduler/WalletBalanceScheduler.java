package world.inclub.wallet.application.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import world.inclub.wallet.application.service.WalletBalanceScheduledServiceImpl;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "scheduler.wallet.balance.reconciliation.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class WalletBalanceScheduler {

    private final WalletBalanceScheduledServiceImpl reconciliationService;

    @Scheduled(
            cron = "${scheduler.wallet.balance.reconciliation.cron:0 0 1 * * ?}",
            zone = "America/Lima"
    )
    public void executeBalanceReconciliation() {
        log.info("Iniciando cronjob de reconciliación de saldos de wallet [Programado: 1:00 AM]");

        reconciliationService.reconcileAllWallets()
                .doOnSuccess(result -> {
                    log.info("Cronjob de reconciliación completado exitosamente");

                    if (result.getTotalUpdated() > 0) {
                        log.info("Estadísticas: {} wallets actualizados de {} procesados",
                                result.getTotalUpdated(), result.getTotalProcessed());
                    }
                })
                .doOnError(error -> {
                    log.error("Error crítico en cronjob de reconciliación: {}",
                            error.getMessage(), error);
                })
                .subscribe();
    }
}
