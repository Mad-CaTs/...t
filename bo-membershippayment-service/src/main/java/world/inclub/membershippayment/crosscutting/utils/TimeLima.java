package world.inclub.membershippayment.crosscutting.utils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.LocalDateTime;

public class TimeLima {

    private static final ZoneId LIMA_ZONE_ID = ZoneId.of("America/Lima");

    /**
     * Converts the given UTC time to Lima, Peru time.
     * 
     * @param utcTime the UTC time to convert
     * @return the converted LocalDateTime in Lima time zone
     */
    public static LocalDateTime convertUtcToLimaTime(ZonedDateTime utcTime) {
        return utcTime.withZoneSameInstant(LIMA_ZONE_ID).toLocalDateTime();
    }

    /**
     * Gets the current time in Lima, Peru time zone.
     * 
     * @return the current LocalDateTime in Lima time zone
     */
    public static LocalDateTime getLimaTime() {
        return ZonedDateTime.now(ZoneId.of("UTC")).withZoneSameInstant(LIMA_ZONE_ID).toLocalDateTime();
    }

    public static LocalDate getLimaDate() {
        return ZonedDateTime.now(ZoneId.of("UTC"))
                .withZoneSameInstant(LIMA_ZONE_ID)
                .toLocalDate();
    }

}