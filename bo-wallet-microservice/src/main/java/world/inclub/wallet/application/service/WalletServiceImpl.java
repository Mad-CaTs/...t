package world.inclub.wallet.application.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.enums.TransactionCategory;
import world.inclub.wallet.domain.port.IWalletPort;
import world.inclub.wallet.infraestructure.exception.common.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements IWalletService {

    private final IWalletPort iWalletPort;
    private static final Logger log = LoggerFactory.getLogger(WalletServiceImpl.class);

    @Override
    public Flux<Wallet> getAlls() {
        return iWalletPort.getall();
    }

    @Override
    public Mono<Wallet> getWalletByIdUser(int idUser) {
        log.info("Get wallet by idUser: {}", idUser);
        return iWalletPort.getWalletByIdUser(idUser)
                .switchIfEmpty(
                        Mono.defer(() -> {
                            log.info("Wallet not found for user id: " + idUser);
                            return Mono.error(new ResourceNotFoundException("Wallet not found for user id: " + idUser));
                        }));
    }

    @Override
    public Mono<Wallet> getWalletById(Long idWallet) {
        return iWalletPort.getWalletById(idWallet);
    }

    @Override
    // Agregar el monto minimo posible
    public Mono<Boolean> checkTransactionValidity(int idUser, BigDecimal transactionAmount) {
        return iWalletPort.getWalletByIdUser(idUser)
                .flatMap(wallet -> {
                    if (wallet.getAvailableBalance().compareTo(transactionAmount) >= 0) {
                        return Mono.just(true);
                    } else {
                        return Mono.just(false);
                    }
                });
    }

    @Override
    public Mono<Boolean> changeBalancesWallet(Wallet wallet, BigDecimal amountTransactAvailableBalance,
            BigDecimal amountTransactAccoutingBalance) {

        // siempre va ser suma ya que se sigue las reglas aritmeticas (+ - = - ; + + = +)
        // al metodo se le pasa el valor real de operación, egreso valor negativo e ingreso valor positivo
        wallet.setAccountingBalance(wallet.getAccountingBalance().add(amountTransactAccoutingBalance));
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(amountTransactAvailableBalance));
        return iWalletPort.updateWallet(wallet).flatMap(update -> {
            if (update) {
                return Mono.just(true);
            } else {
                // Manejo de Error Personalizado
                return Mono.just(false);
            }
        });

    }

    @Override
    public Mono<Boolean> aprobacionaccountingBalance(Wallet wallet, BigDecimal amountTransactAvailableBalance,
                                              BigDecimal amountTransactAccoutingBalance) {

        // siempre va ser suma ya que se sigue las reglas aritmeticas (+ - = - ; + + = +)
        // al metodo se le pasa el valor real de operación, egreso valor negativo e ingreso valor positivo
        wallet.setAccountingBalance(wallet.getAccountingBalance().add(amountTransactAccoutingBalance));
        return iWalletPort.updateWallet(wallet).flatMap(update -> {
            if (update) {
                return Mono.just(true);
            } else {
                // Manejo de Error Personalizado
                return Mono.just(false);
            }
        });

    }
    @Override
    public Mono<Boolean> solicitudeAvailableBalance(Wallet wallet, BigDecimal amountTransactAvailableBalance,
                                              BigDecimal amountTransactAccoutingBalance) {

        // siempre va ser suma ya que se sigue las reglas aritmeticas (+ - = - ; + + = +)
        // al metodo se le pasa el valor real de operación, egreso valor negativo e ingreso valor positivo
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(amountTransactAvailableBalance));
        return iWalletPort.updateWallet(wallet).flatMap(update -> {
            if (update) {
                return Mono.just(true);
            } else {
                // Manejo de Error Personalizado
                return Mono.just(false);
            }
        });

    }

    @Override
    public Mono<Boolean> changeAccountingBalanceWallet(Wallet wallet, BigDecimal amountTransactAccoutingBalance,
            int idTransactionCategory) {

        // siempre va ser suma ya que se sigue las reglas aritmeticas (+ - = - ; + + =
        // +)
        // al metodo se le pasa el valor real de operación, egreso valor negativo e
        // ingreso valor positivo
        // se modifica solo el tipo de saldo de acuerdo a la categoría
        if ((idTransactionCategory == TransactionCategory.Ingreso.getValue())
                || (idTransactionCategory == TransactionCategory.Deuda.getValue())) {

            wallet.setAccountingBalance(wallet.getAccountingBalance().add(amountTransactAccoutingBalance));

        } else if ((idTransactionCategory == TransactionCategory.Egreso.getValue())
                || (idTransactionCategory == TransactionCategory.PagoDeuda.getValue())) {

            wallet.setAvailableBalance(wallet.getAvailableBalance().add(amountTransactAccoutingBalance));
        }

        return iWalletPort.updateWallet(wallet).flatMap(update -> {
            if (update) {
                return Mono.just(true);
            } else {
                // Manejo de Error Personalizado
                return Mono.just(false);
            }
        });
    }

    @Override
    public Mono<Boolean> changeAccountingBalanceWalletBrandExclusive(Wallet wallet,
            BigDecimal amountTransactAccoutingBalance, int idTransactionCategory) {

        if ((idTransactionCategory == TransactionCategory.Ingreso.getValue())
                || (idTransactionCategory == TransactionCategory.Deuda.getValue())) {

            wallet.setAccountingBrandExclusive(wallet.getAccountingBalance().add(amountTransactAccoutingBalance));

        } else if ((idTransactionCategory == TransactionCategory.Egreso.getValue())
                || (idTransactionCategory == TransactionCategory.PagoDeuda.getValue())) {

            wallet.setAvailableBrandExclusive(wallet.getAvailableBalance().add(amountTransactAccoutingBalance));
        }

        return iWalletPort.updateWallet(wallet).flatMap(update -> {
            if (update) {
                return Mono.just(true);
            } else {
                // Manejo de Error Personalizado
                return Mono.just(false);
            }
        });
    }

}
