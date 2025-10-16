package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class MakePaymentRequest {

    @NotNull(message = "Schedule ID is required")
    private UUID scheduleId;

    @NotNull(message = "Member ID is required")
    @Positive(message = "Member ID must be positive")
    private Long memberId;

    @NotNull(message = "Bonus type ID is required")
    @Positive(message = "Bonus type ID must be positive")
    private Integer bonusTypeId;

    @NotNull(message = "Payment type ID is required")
    @Positive(message = "Payment type ID must be positive")
    private Integer paymentTypeId;

    @NotNull(message = "Payment sub type ID is required")
    private Integer paymentSubTypeId;

    @NotNull(message = "Currency type ID is required")
    @Positive(message = "Currency type ID must be positive")
    private Integer currencyTypeId;

    @NotNull(message = "Sub total amount is required")
    @DecimalMin(value = "0.00", message = "Sub total amount must be greater than or equal to 0")
    private BigDecimal subTotalAmount;

    @NotNull(message = "Commission amount is required")
    @DecimalMin(value = "0.00", message = "Commission amount must be greater than or equal to 0")
    private BigDecimal commissionAmount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotEmpty(message = "At least one voucher is required")
    @Valid
    private List<Voucher> vouchers;

    @NotNull(message = "Payment date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant paymentDate;

    @Data
    @NoArgsConstructor
    public static class Voucher {

        @NotBlank(message = "Operation number is required")
        @Size(max = 100, message = "Operation number must not exceed 100 characters")
        private String operationNumber;

        @Size(max = 1000, message = "Note must not exceed 1000 characters")
        private String note;

        @NotNull(message = "Voucher image is required")
        private FilePart image;
    }
}
