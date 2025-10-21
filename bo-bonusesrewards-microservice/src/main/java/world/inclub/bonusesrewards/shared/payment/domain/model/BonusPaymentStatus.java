package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import world.inclub.bonusesrewards.shared.exceptions.InvalidStatusException;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum BonusPaymentStatus {

    /**
     * Payment is completed successfully
     */
    COMPLETED(1L, "COMPLETED"),
    /**
     * Payment is pending and awaiting processing
     */
    PENDING(2L, "PENDING"),
    /**
     * Payment has failed due to an error
     */
    FAILED(3L, "FAILED"),
    /**
     * Payment is pending review
     */
    PENDING_REVIEW(4L, "PENDING_REVIEW"),
    /**
     * Payment has been rejected
     */
    REJECTED(5L, "REJECTED");

    private final Long id;
    private final String code;

    public static BonusPaymentStatus fromId(Long id) {
        return Arrays.stream(values())
                .filter(status -> status.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid PaymentStatus ID: " + id));
    }

    public static BonusPaymentStatus fromName(String code) {
        return Arrays.stream(values())
                .filter(status -> status.getCode().equals(code))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid PaymentStatus Name: " + code));
    }

}