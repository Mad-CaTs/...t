package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import world.inclub.wallet.api.dtos.*;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface IWalletTransactionService {


    public Mono<Boolean> registerTransferBetweenPartners(int idUserEnvia, int idUserReceivingTransfer,WalletTransaction walletTransaction, TokenRequestDTO tokenRequest);

    public Mono<Boolean> registerTransferBetweenWallets(UserAccountDTO userEnvia, UserAccountDTO userReceivingTransfer, BigDecimal amount, boolean isTransactionAdmin, boolean isTranferPayLater, LocalDateTime initialDate);

    public Mono<WalletTransaction> registerTransaction(WalletTransaction transaction, int idUser);
    public Mono<Boolean> solictudBanTransaction(WalletTransaction transaction, int idUser);
    public Mono<Boolean> rechasoBanTransaction(WalletTransaction transaction, int idUser);
    public Mono<WalletTransaction> aprobacionBanTransaction(WalletTransaction transaction, int idUser);

    public Mono<Boolean> checkUserAllowedTransfer(boolean isUserAllowedTransfer);

    public Mono<Boolean> checkValidityTransactionRegardingAmount(int idUser, int idTransactionCategory, BigDecimal amountTransaction);

    public Mono<WalletTransaction> registerTransactionAvailableBalance(WalletTransaction transaction, Long idWallet, ExchangeRateDTO exchagenRate,
    int idTypeWalletTransaction, int idCurrency);

    public Mono<WalletTransaction> registerTransactionAccountingBalance(WalletTransaction transaction, Long idWallet, ExchangeRateDTO exchagenRate,
    int idTypeWalletTransaction, int idCurrency);

    public Mono<WalletTransaction> processPaymentWithWallet(Long idUserPayment, WalletTransaction transaction, int typeWalletTransaction, Boolean isFullPayment, String detailPayment);
    public Flux<WalletTransactionResponseDTO> getWalletSuccessfulTransactions(int idWallet,String search);
    public Flux<WalletTransactionResponseDTO> getWalletTransferTransactions(int idWallet, List<Integer> transferTypeIds,String search);
    public Flux<WalletTransactionResponseDTO> getWalletRechargeTransactions(int idWallet, Integer transferTypeIds,String search);
    public Flux<TypeWalletTransactionResponseDTO> listTypeWalletTransaction();
    Mono<Tuple2<Flux<WalletTransactionResponseDTO>,Integer>> getWalletSuccessfulTransactionsWhitPagina(Integer idWallet,int page, int size,String search);
    Mono<Tuple2<Flux<WalletTransactionResponseDTO>, Integer>> getWalletTransferTransactionsWithPagination(Integer idWallet, int page, int size, List<Integer> transferTypeIds,String search);
    Mono<Tuple2<Flux<WalletTransactionResponseDTO>, Integer>> getWalletRechargeTransactionsWithPagination(Integer idWallet, int page, int size, Integer transferTypeIds,String search);
    Mono<Boolean> validateWalletCode(Integer walletCode);

    Mono<WalletTransaction> registerAdminPanelTransaction (AdminPanelTransactionRequest request);

    Mono<WalletTransactionRechargeDTO> walletChargerPaypal(AdminPanelTransactionRequest request, String code);

    Mono<Boolean> rollbackTransactionAndRefund(Integer idTransaction);

    Mono<Boolean> registerTransferBetweenWallets(WalletTransactionRequest request);

}
