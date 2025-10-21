package world.inclub.wallet.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestAccountBankResponseDTO;
import world.inclub.wallet.domain.entity.WalletTransaction;

public interface IWithdrawalRequestAccountBankService {

    public Mono<Boolean> generateWithDrawalRequestAccountBank(WalletTransaction walletTransaction,int idUser, Long idAccountBank, Mono<FilePart> file, String description);
    public Flux<WithDrawalRequestAccountBankResponseDTO> getWDRAccountBankByIdUser(Integer idUser);

}
