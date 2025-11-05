package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.scheduler.WalletScheduledResult;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.port.IWalletPort;
import world.inclub.wallet.domain.port.IWalletTransactionPort;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletBalanceScheduledServiceImpl {

    private final IWalletPort walletPort;
    private final IWalletTransactionPort walletTransactionPort;

    public Mono<WalletScheduledResult> reconcileAllWallets() {
        LocalDateTime startTime = LocalDateTime.now();
        log.info("=== INICIO RECONCILIACIÓN DE SALDOS DE WALLET ===");
        log.info("Fecha y hora de inicio: {}", startTime);

        AtomicInteger processedCount = new AtomicInteger(0);
        AtomicInteger updatedCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicInteger noChangeCount = new AtomicInteger(0);

        return walletPort.getall()
                .flatMap(wallet -> reconcileSingleWallet(wallet)
                        .doOnSuccess(updated -> {
                            processedCount.incrementAndGet();
                            if (updated) {
                                updatedCount.incrementAndGet();
                            } else {
                                noChangeCount.incrementAndGet();
                            }
                        })
                        .onErrorResume(error -> {
                            errorCount.incrementAndGet();
                            log.error("Error procesando Wallet ID: {} - {}",
                                    wallet.getIdWallet(), error.getMessage(), error);
                            return Mono.just(false);
                        })
                )
                .then(Mono.defer(() -> {
                    LocalDateTime endTime = LocalDateTime.now();
                    Duration duration = Duration.between(startTime, endTime);

                    WalletScheduledResult result = WalletScheduledResult.builder()
                            .startTime(startTime)
                            .endTime(endTime)
                            .duration(duration)
                            .totalProcessed(processedCount.get())
                            .totalUpdated(updatedCount.get())
                            .totalNoChanges(noChangeCount.get())
                            .totalErrors(errorCount.get())
                            .build();

                    logSummary(result);
                    return Mono.just(result);
                }))
                .onErrorResume(error -> {
                    log.error("ERROR CRÍTICO en reconciliación de wallets: {}", error.getMessage(), error);
                    LocalDateTime endTime = LocalDateTime.now();
                    Duration duration = Duration.between(startTime, endTime);

                    WalletScheduledResult result = WalletScheduledResult.builder()
                            .startTime(startTime)
                            .endTime(endTime)
                            .duration(duration)
                            .totalProcessed(processedCount.get())
                            .totalUpdated(updatedCount.get())
                            .totalNoChanges(noChangeCount.get())
                            .totalErrors(errorCount.get() + 1)
                            .criticalError(error.getMessage())
                            .build();

                    logSummary(result);
                    return Mono.just(result);
                });
    }

    private Mono<Boolean> reconcileSingleWallet(Wallet wallet) {
        log.debug("Procesando Wallet ID: {}, Usuario ID: {}", wallet.getIdWallet(), wallet.getIdUser());

        return walletTransactionPort.getTransactionsByIdWallet(wallet.getIdWallet())
                .filter(tx -> tx.getIsSucessfulTransaction() != null && tx.getIsSucessfulTransaction())
                .filter(tx -> tx.getAmount() != null)
                .collectList()
                .flatMap(transactions -> {
                    if (transactions.isEmpty()) {
                        log.debug("Wallet ID: {} no tiene transacciones exitosas", wallet.getIdWallet());
                        return validateAndUpdateIfNeeded(wallet, BigDecimal.ZERO);
                    }

                    BigDecimal expectedBalance = calculateExpectedBalance(transactions);
                    return validateAndUpdateIfNeeded(wallet, expectedBalance);
                })
                .onErrorResume(error -> {
                    log.error("Error en reconciliación de Wallet ID: {} - {}",
                            wallet.getIdWallet(), error.getMessage());
                    return Mono.just(false);
                });
    }

    private BigDecimal calculateExpectedBalance(List<WalletTransaction> transactions) {
        return transactions.stream()
                .map(WalletTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Mono<Boolean> validateAndUpdateIfNeeded(Wallet wallet, BigDecimal expectedBalance) {
        BigDecimal currentAvailable = wallet.getAvailableBalance();
        BigDecimal currentAccounting = wallet.getAccountingBalance();

        log.debug("Wallet ID: {} - Disponible: {}, Contable: {}, Calculado: {}",
                wallet.getIdWallet(), currentAvailable, currentAccounting, expectedBalance);

        boolean hasRetention = !currentAvailable.equals(currentAccounting);

        if (hasRetention) {
            log.info("Wallet ID: {} tiene retención (Disp: {}, Cont: {}). NO se balancea.",
                    wallet.getIdWallet(), currentAvailable, currentAccounting);
            return Mono.just(false);
        }

        boolean needsUpdate = currentAvailable.compareTo(expectedBalance) != 0;

        if (needsUpdate) {
            log.warn("DESBALANCE DETECTADO - Wallet ID: {}, Usuario ID: {}",
                    wallet.getIdWallet(), wallet.getIdUser());
            log.warn("   - Saldo Actual: {} -> Saldo Calculado: {}",
                    currentAvailable, expectedBalance);

            wallet.setAvailableBalance(expectedBalance);
            wallet.setAccountingBalance(expectedBalance);

            return walletPort.updateWallet(wallet)
                    .doOnSuccess(updated -> {
                        if (updated) {
                            log.info("Wallet ID: {} ACTUALIZADO correctamente", wallet.getIdWallet());
                        } else {
                            log.error("Falló actualización de Wallet ID: {}", wallet.getIdWallet());
                        }
                    });
        } else {
            log.debug("✓ Wallet ID: {} - Saldos OK, no requiere actualización", wallet.getIdWallet());
            return Mono.just(false);
        }
    }

    private void logSummary(WalletScheduledResult result) {
        log.info("=== RESUMEN FINAL DE RECONCILIACIÓN ===");
        log.info("Hora de inicio: {}", result.getStartTime());
        log.info("Hora de fin: {}", result.getEndTime());
        log.info("Duración: {} minutos {} segundos",
                result.getDuration().toMinutes(),
                result.getDuration().toSecondsPart());
        log.info("Total wallets procesados: {}", result.getTotalProcessed());
        log.info("Wallets actualizados: {}", result.getTotalUpdated());
        log.info("Wallets sin cambios: {}", result.getTotalNoChanges());
        log.info("Errores: {}", result.getTotalErrors());

        if (result.getCriticalError() != null) {
            log.error("ERROR CRÍTICO: {}", result.getCriticalError());
        }

        if (result.getTotalProcessed() > 0) {
            double errorRate = (double) result.getTotalErrors() / result.getTotalProcessed() * 100;
            double updateRate = (double) result.getTotalUpdated() / result.getTotalProcessed() * 100;

            if (errorRate > 10) {
                log.error("ALERTA CRÍTICA: {}% de wallets con errores", String.format("%.2f", errorRate));
            }

            if (updateRate > 10) {
                log.warn("ALERTA: {}% de wallets requirieron actualización", String.format("%.2f", updateRate));
            }
        }

        log.info("=== FIN DE RECONCILIACIÓN ===");
    }
}
