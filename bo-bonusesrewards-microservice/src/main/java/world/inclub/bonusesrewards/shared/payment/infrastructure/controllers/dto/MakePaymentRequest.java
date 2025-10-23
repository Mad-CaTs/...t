package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
public class MakePaymentRequest {

    @NotNull
    private UUID scheduleId;

    @NotNull
    @Positive
    private Long memberId;

    @NotNull
    private BonusType bonusType;

    @NotNull
    private PaymentType paymentType;

    @NotNull
    private Integer paymentSubTypeId;

    @NotNull
    private CurrencyType currencyType;

    @NotNull
    @Positive(message = "Total amount must be higher than 0.")
    @Digits(integer = 10, fraction = 2, message = "Total amount must have a maximum of 2 decimal.")
    private BigDecimal totalAmount;

    private Voucher voucher;

    private PayPal paypal;

    @Data
    @NoArgsConstructor
    public static class Voucher {

        @NotBlank
        private String operationNumber;

        @NotBlank
        private String note;

        @NotNull
        private FilePart image;
    }

    @Data
    @NoArgsConstructor
    public static class PayPal {

        @NotBlank(message = "Transaction ID is required for PayPal payments")
        private String transactionId;

        private String note;
    }
}
