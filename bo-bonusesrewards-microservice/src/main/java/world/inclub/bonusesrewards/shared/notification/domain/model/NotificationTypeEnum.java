package world.inclub.bonusesrewards.shared.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotificationTypeEnum {

    /*
     * Member has qualified for the car bonus program.
     */
    CAR_BONUS_QUALIFIED(1L, "CAR_BONUS_QUALIFIED"),

    /*
     * Initial car bonus installment schedule has been created.
     */
    CAR_INITIAL_SCHEDULE_CREATED(2L, "CAR_INITIAL_SCHEDULE_CREATED"),

    /*
     * Monthly car bonus installment schedule has been generated.
     */
    CAR_MONTHLY_SCHEDULE_CREATED(3L, "CAR_MONTHLY_SCHEDULE_CREATED"),

    /*
     * Support has uploaded the car documents and they are now available for the member to view.
     */
    CAR_DOCUMENTS_READY(4L, "CAR_DOCUMENTS_READY"),

    /*
     * Reminder for upcoming installment payment.
     */
    PAYMENT_REMINDER(5L, "PAYMENT_REMINDER");

    private final Long id;
    private final String code;

    public static NotificationTypeEnum fromId(Long id) {
        for (NotificationTypeEnum type : values()) {
            if (type.getId().equals(id)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid NotificationTypeEnum ID: " + id);
    }

    public static NotificationTypeEnum fromName(String code) {
        for (NotificationTypeEnum type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid NotificationTypeEnum Name: " + code);
    }

}
