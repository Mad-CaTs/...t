package world.inclub.wallet.infraestructure.serviceagent.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InfoEmail {

    private int  typeTemplate;
    private String operationNumber;
    private Integer idFamilyPackage;
    private String token;
    private Integer idWalletTransactionEnvio;
   @JsonProperty("ISENVIOEMAILMASTER")
    private boolean ISENVIOEMAILMASTER;
    @JsonProperty("ISSENDEMAILSPONSOR")
    private boolean ISSENDEMAILSPONSOR;
    private String pathPicture;
    private String packageName;
    private String packageDescription;
    private BigDecimal amountPaid;
    
    //retiro bancaria
    private LocalDateTime fechaSolicitud;
    private String cuentaInterbancaria;
    private String nameBank;
    private String motivo;
    private String msg;

    private String linkPayment;
    private List<String> listTitlesQuoterejected;
    private List<String> nrosOperation;
    private String detail;

    private String membership;
    //this affiliatePayDTO is used to send the email to the affiliate
    private Long idsuscription;
    private Long numberQuotas;

    //recarga con paypal, cálculo de costos
    private BigDecimal subTotal;
    private BigDecimal tasa;
    private BigDecimal comision;
    private BigDecimal totalMount;
    private String paypalTransactionCode;
    private String createdUp;


    public InfoEmail( String token) {
        this.typeTemplate = 9;
        this.token = token;
    }


    public InfoEmail( Integer idWalletTransactionEnvio) {
        this.typeTemplate = 10;
        this.idFamilyPackage = 1;
        this.idWalletTransactionEnvio = idWalletTransactionEnvio;
    }

    public InfoEmail(BigDecimal subTotal, BigDecimal tasa, BigDecimal comision, BigDecimal totalMount, String paypalCode, String createdUp){

        this.subTotal = subTotal ;
        this.tasa = tasa;
        this.comision = comision;
        this.totalMount = totalMount;
        this.paypalTransactionCode =paypalCode ;
        this.createdUp =createdUp ;

        this.typeTemplate = 24;
        this.idFamilyPackage = 1;
        this.ISENVIOEMAILMASTER= false;
        this.ISSENDEMAILSPONSOR = false;
    }


}

