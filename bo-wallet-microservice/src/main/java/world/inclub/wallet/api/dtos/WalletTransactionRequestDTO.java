package world.inclub.wallet.api.dtos;

import java.math.BigDecimal;

import org.springframework.http.codec.multipart.FilePart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.WalletTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionRequestDTO {

    private int idUser;
    private BigDecimal transactionAmount;
    private int idUserReceivingTransfer;
    private Long idElectronicPurse;
    private Long idAccountBank;
    private Mono<FilePart>  file;
    private String description;
    private WalletTransaction walletTransaction;
    private TokenRequestDTO tokenRequest;
    
    public WalletTransactionRequestDTO(int idUser, int idUserReceivingTransfer, WalletTransaction walletTransaction) {
        this.idUser = idUser;
        this.idUserReceivingTransfer = idUserReceivingTransfer;
        this.walletTransaction = walletTransaction;
    }

    public WalletTransactionRequestDTO(int idUser, BigDecimal transactionAmount) {
        this.idUser = idUser;
        this.transactionAmount = transactionAmount;
    }

    public WalletTransactionRequestDTO(int idUser, BigDecimal transactionAmount, int idUserReceivingTransfer) {
        this.idUser = idUser;
        this.transactionAmount = transactionAmount;
        this.idUserReceivingTransfer = idUserReceivingTransfer;
    }

    


}
