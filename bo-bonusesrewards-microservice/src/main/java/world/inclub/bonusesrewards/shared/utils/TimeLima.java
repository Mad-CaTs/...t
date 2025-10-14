package world.inclub.bonusesrewards.shared.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class TimeLima {

    private static final ZoneId LIMA_ZONE_ID = ZoneId.of("America/Lima");

    /**
     * Converts a date and time in UTC to the Lima, Peru time zone.
     *
     * @param utcTime The date and time in UTC.
     * @return The date and time converted to the Lima time zone.
     */
    public static LocalDateTime convertUtcToLimaTime(ZonedDateTime utcTime) {
        return utcTime.withZoneSameInstant(LIMA_ZONE_ID).toLocalDateTime();
    }

    /**
     * Gets the current date and time in the Lima, Peru time zone.
     *
     * @return The current date and time in Lima.
     */
    public static LocalDateTime getLimaTime() {
        return ZonedDateTime.now(ZoneId.of("UTC")).withZoneSameInstant(LIMA_ZONE_ID).toLocalDateTime();
    }

    /**
     * Gets the current date in the Lima, Peru time zone.
     *
     * @return The current date in Lima.
     */
    public static LocalDate getLimaDate() {
        return ZonedDateTime.now(ZoneId.of("UTC"))
                .withZoneSameInstant(LIMA_ZONE_ID)
                .toLocalDate();
    }

}
