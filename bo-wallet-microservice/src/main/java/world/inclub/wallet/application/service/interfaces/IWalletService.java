package world.inclub.wallet.application.service.interfaces;

import java.math.BigDecimal;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Wallet;

public interface IWalletService {

    public Flux<Wallet> getAlls();

    public Mono<Wallet> getWalletByIdUser(int idUser);
    Mono<Wallet> getWalletById(Long idWallet);

    public Mono<Boolean> checkTransactionValidity(int idUser, BigDecimal transactionAmount);

    public Mono<Boolean> changeBalancesWallet(Wallet wallet, BigDecimal amountTransactAvailableBalance, BigDecimal amountTransactAccoutingBalance);
    public Mono<Boolean> aprobacionaccountingBalance(Wallet wallet, BigDecimal amountTransactAvailableBalance, BigDecimal amountTransactAccoutingBalance);
    public Mono<Boolean> solicitudeAvailableBalance(Wallet wallet, BigDecimal amountTransactAvailableBalance, BigDecimal amountTransactAccoutingBalance);

    public Mono<Boolean> changeAccountingBalanceWallet(Wallet wallet, BigDecimal amountTransactAccoutingBalance, int idTransactionCategory);

    public Mono<Boolean> changeAccountingBalanceWalletBrandExclusive(Wallet wallet, BigDecimal amountTransactAccoutingBalance, int idTransactionCategory);
}
