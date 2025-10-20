package world.inclub.appnotification.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InfoEmail {

    private int  typeTemplate;

    private String operationNumber;

    private String paymentTypeOld;

    private BigDecimal amountPaid;

    private String paymentSubTypeOld;

    private String paymentTypeNew;

    private String paymentSubTypeNew;

    private String otherEmail;
    private  LocalDateTime fechaSolicitud;
    private String cuentaInterbancaria;
    private String nameBank;
    private String msg;
    private String motivo;
    private String token;

    @JsonProperty("ISENVIOEMAILMASTER")
    private boolean ISENVIOEMAILMASTER;

    @JsonProperty("ISSENDEMAILSPONSOR")
    private boolean ISSENDEMAILSPONSOR;

    private String pathPicture;

    private String packageName;

    private Integer idFamilyPackage;

    private String suscriptionName;
    private String packageDescription;
    private String documentNameLegal;

    private Integer idWalletTransactionEnvio;

    private String date;

    Reason reasonReject;

    String linkPayment;

    List<String> listTitlesQuoterejected;

    List<String> nrosOperation;

    Document document;

    //this affiliatePayDTO is used to send the email to the affiliate
    private Long idsuscription;

    private Long numberQuotas;

    ////paypal recarga
    private BigDecimal subTotal;
    private BigDecimal tasa;
    private BigDecimal comision;
    private BigDecimal totalMount;
    private String paypalTransactionCode;
    private String createdUp;

    /// commissions
    private Integer levelSponsor;
    private Double percentage;
    private String typeBonusName;
    private String membership;
    private String byState;
    private String byMembership;
    private LocalDateTime initialDatePeriod;
    private LocalDateTime endDatePeriod;

    //Legal pago
    private BigDecimal costoEnvio;
    private BigDecimal costoApostillado;
    private String currencyLegal;

    //Beneficiario
    private String nameBeneficiary;
    private String lastNameBeneficiary;
    private String documentNumberBeneficiary;
    private String emailBeneficiary;

    private String subject;
    private String event;


}
