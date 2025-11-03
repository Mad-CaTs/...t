package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.WalletTransactionResponseDTO;
import world.inclub.wallet.domain.entity.WalletTransaction;

import java.util.List;

public interface IWalletTransactionPort {

    Mono<WalletTransaction> saveWalletTransaction(WalletTransaction transaction);
    Flux<WalletTransactionResponseDTO> getWalletSuccessfulTransactionsResponse(int idWallet,String search);
    Flux<WalletTransactionResponseDTO> getWalletTransferTransactionsResponse(int idWallet,List<Integer> transferTypeIds,String search);
    Flux<WalletTransactionResponseDTO> getWalletRechargeTransactionsResponse(int idWallet,Integer transferTypeIds,String search);
    Mono<WalletTransaction> getWalletTransactionById( Long idWalletTransaction);
    Flux<WalletTransaction> getTransactionsByIdWallet(Long idWallet);
}
