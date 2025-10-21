package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountBankResponse {
    private Long idAccountBank;
    private Long idCountry;
    private String nameCountry;
    private String bankAddress;
    private String codeSwift;
    private String codeIban;
    private String numberAccount;
    private String cci;
    private Long idTypeAccountBank;
    private String nameTypeAccountBank;
    private String nameHolder;
    private String numberContribuyente;
    private String razonSocial;
    private String addressFiscal;
    private Boolean status;
    private Long idBank;
    private String nameBank;
    private Integer currencyIdBank;
    private Long idUser;
    private String lastNameHolder;
    private String email;
    private Long idDocumentType;
    private String numDocument;
    private  Boolean titular;
    private  Integer idbankstatus;

}
