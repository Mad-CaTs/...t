package world.inclub.wallet.api.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.relational.core.mapping.Column;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithDrawalRequestAccountBankResponseDTO {

    private Integer id;
    private Integer idWalletTransaction;
    private Integer destinationCurrencyId;
    private Integer idRequestStates;
    private LocalDateTime closingDate;
    private String imageFile;

    private Integer idAccountBank;
    private Integer idTypeAccountBank;
    private String holder;
    private String accountNumber;
    private String taxpayerNumber;
    private String companyName;
    private String fiscalAddress;
    private String cci;
    private Boolean status;
    private String bankAddress;
    private String swift;
    private String iban;

    public Integer idBank;
    public String nameBank;
    public String abbreviationBank;
    public String detailNameOtherBank;
    public String bankCountry;
    
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
