package world.inclub.wallet.api.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithDrawalRequestElectronicPurseResponseDTO {

    private Integer id;
    private Integer idWalletTransaction;
    private Integer destinationCurrencyId;
    private Integer idRequestStates;
    private LocalDateTime closingDate;
    private String imageFile;
    
    private Integer idElectronicPurse;
    private String holderName;
    private String holderLastName;
    private String usernameAccount;
    private String paidLink;
    private LocalDateTime initialDate;
    private String referenceData;
    private BigDecimal amount;
    private Integer idUser;
    private String destinationCurrency;
    private String abbreviationCurrency;
    private String nameRequest;
    private String nameUser;
    private String lastNameUser;
    private String email;
    
}
