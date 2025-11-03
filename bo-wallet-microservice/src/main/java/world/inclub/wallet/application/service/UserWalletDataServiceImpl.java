package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.application.service.interfaces.UserWalletDataService;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.port.ITypeWalletTransactionPort;
import world.inclub.wallet.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.wallet.infraestructure.serviceagent.dtos.UserAccountResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.WalletTransactionResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.AccountService;

import java.util.Comparator;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserWalletDataServiceImpl implements UserWalletDataService {

    private final AccountService accountService;
    private final IWalletService walletService;
    private final IWalletTransactionService walletTransactionService;
    private final ITypeWalletTransactionPort typeWalletTransactionPort;

    @Override
    public Mono<UserWalletDataResponse> getFullWalletDataByUserId(Integer idUser) {
        return Mono.zip(accountService.getUserAccountById(idUser), walletService.getWalletByIdUser(idUser))
                .flatMap(tuple -> {
                    UserAccountResponse userAccount = tuple.getT1();
                    Wallet wallet = tuple.getT2();

                    return walletTransactionService.getTransactionsByIdWallet(wallet.getIdWallet())
                            .collectList()
                            .flatMap(transactions -> enrichTransactionsWithTypeDescriptions(transactions)
                                    .map(enrichedTransactions ->
                                            buildUserWalletDataResponse(userAccount, wallet, enrichedTransactions))
                            );
                })
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontró información para el usuario id: " + idUser)))
                .doOnError(error -> log.error("Error obteniendo información del usuario {}: {}", idUser, error.getMessage()));
    }

    private Mono<List<WalletTransactionResponse>> enrichTransactionsWithTypeDescriptions(List<WalletTransaction> transactions) {
        if (transactions.isEmpty()) {
            return Mono.just(List.of());
        }

        List<Integer> typeIds = transactions.stream()
                .map(WalletTransaction::getIdTypeWalletTransaction)
                .distinct()
                .toList();

        return typeWalletTransactionPort.findAllByIds(typeIds)
                .collectMap(TypeWalletTransaction::getIdTypeWalletTransaction, TypeWalletTransaction::getDescription)
                .map(typeMap -> transactions.stream()
                        .sorted(Comparator.comparing(WalletTransaction::getInitialDate).reversed())
                        .map(tx -> new WalletTransactionResponse(tx,
                                typeMap.getOrDefault(tx.getIdTypeWalletTransaction(), "Sin descripción")
                        ))
                        .toList());
    }

    private UserWalletDataResponse buildUserWalletDataResponse(
            UserAccountResponse userAccount,
            Wallet wallet,
            List<WalletTransactionResponse> transactions) {

        return new UserWalletDataResponse(userAccount, wallet, transactions);
    }
}