package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InfoEmail {
    private int  typeTemplate;
    private String operationNumber;
    private String paymentTypeOld;
    private BigDecimal amountPaid;
    private String paymentSubTypeOld;
    private String paymentTypeNew;
    private String paymentSubTypeNew;
    private String token;
    private String otherEmail;
    private boolean ISENVIOEMAILMASTER;
    private boolean ISSENDEMAILSPONSOR;
    private String pathPicture;
    private String packageName;
    private Integer idFamilyPackage;
    private String packageDescription;

    //Beneficiario
    private String nameBeneficiary;
    private String lastNameBeneficiary;
    private String documentNumberBeneficiary;
    private String emailBeneficiary;
    private String subject;
    private String event;

}
