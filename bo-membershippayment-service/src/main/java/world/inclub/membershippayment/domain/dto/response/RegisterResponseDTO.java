package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;
import world.inclub.membershippayment.domain.enums.FlagEnabled;

import java.math.BigDecimal;

@Data
public class RegisterResponseDTO {
    private FlagEnabled isQuotaInitialSplitting;
    private int numberQuotesInitial;
    private int idSuscriptionPay ;
    private BigDecimal totalAmount;
    private int idUserPay;
    private long idPayment;
    private String idResidenceCountry;
    private Boolean isPayLatter;
}
