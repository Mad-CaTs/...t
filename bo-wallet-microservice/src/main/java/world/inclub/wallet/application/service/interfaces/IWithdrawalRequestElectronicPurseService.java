package world.inclub.wallet.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestElectronicPurseResponseDTO;
import world.inclub.wallet.domain.entity.WalletTransaction;

public interface IWithdrawalRequestElectronicPurseService {

    public Mono<Boolean> generateWithdrawalRequestElectronicPurse(WalletTransaction walletTransaction, int idUser, Long idElectronecPurse, Mono<FilePart> file, String description);
    public Flux<WithDrawalRequestElectronicPurseResponseDTO> getWDRElectronicPurseByIdUser(Integer idUser);

}
