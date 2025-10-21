package world.inclub.bonusesrewards.shared.utils.datetime;

import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Utility class for formatting date and time objects to strings
 */
public class DateTimeFormatter {

    private static final java.time.format.DateTimeFormatter ISO_INSTANT_FORMATTER =
            java.time.format.DateTimeFormatter.ISO_INSTANT;

    private static final java.time.format.DateTimeFormatter ISO_LOCAL_DATE_FORMATTER =
            java.time.format.DateTimeFormatter.ISO_LOCAL_DATE;

    private static final java.time.format.DateTimeFormatter ISO_LOCAL_DATE_TIME_FORMATTER =
            java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private static final java.time.format.DateTimeFormatter CUSTOM_DATE_TIME_FORMATTER =
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final java.time.format.DateTimeFormatter CUSTOM_DATE_FORMATTER =
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private DateTimeFormatter() {
        // Utility class - private constructor
    }

    /**
     * Format an Instant to ISO-8601 string format (e.g., "2023-09-25T10:30:00Z")
     *
     * @param instant the Instant to format, can be null
     * @return formatted string or null if input is null
     */
    public static String formatInstant(Instant instant) {
        return instant != null ? ISO_INSTANT_FORMATTER.format(instant) : null;
    }

    /**
     * Format an Instant using timezone
     *
     * @param instant the Instant to format, can be null
     * @return formatted string or null if input is null
     */
    public static String formatInstantWithContext(Instant instant) {
        if (instant == null) return null;

        ZoneId zoneId = TimezoneContext.getTimezone();
        ZonedDateTime zonedDateTime = instant.atZone(zoneId);
        return CUSTOM_DATE_TIME_FORMATTER.format(zonedDateTime);
    }

    public static String formatInstantToDateWithContext(Instant instant) {
        if (instant == null) return null;

        ZoneId zoneId = TimezoneContext.getTimezone();
        ZonedDateTime zonedDateTime = instant.atZone(zoneId);
        return CUSTOM_DATE_FORMATTER.format(zonedDateTime);
    }

    /**
     * Format an Instant to custom date-time string format using specified timezone
     * (e.g., "2023-09-25 10:30:00" in the specified timezone)
     *
     * @param instant the Instant to format, can be null
     * @param zoneId  the timezone to use for formatting, can be null (defaults to UTC)
     * @return formatted string or null if input is null
     */
    public static String formatInstant(Instant instant, ZoneId zoneId) {
        if (instant == null) return null;
        if (zoneId == null) zoneId = ZoneId.of("UTC");

        ZonedDateTime zonedDateTime = instant.atZone(zoneId);
        return CUSTOM_DATE_TIME_FORMATTER.format(zonedDateTime);
    }

    /**
     * Format a LocalDate to ISO-8601 string format (e.g., "2023-09-25")
     *
     * @param date the LocalDate to format, can be null
     * @return formatted string or null if input is null
     */
    public static String formatLocalDate(LocalDate date) {
        return date != null ? ISO_LOCAL_DATE_FORMATTER.format(date) : null;
    }

    /**
     * Format a LocalDateTime to ISO-8601 string format (e.g., "2023-09-25T10:30:00")
     *
     * @param dateTime the LocalDateTime to format, can be null
     * @return formatted string or null if input is null
     */
    public static String formatLocalDateTime(LocalDateTime dateTime) {
        return dateTime != null ? ISO_LOCAL_DATE_TIME_FORMATTER.format(dateTime) : null;
    }

    /**
     * Format an Instant to ISO-8601 string format with default value
     *
     * @param instant      the Instant to format, can be null
     * @param defaultValue the value to return if instant is null
     * @return formatted string or defaultValue if input is null
     */
    public static String formatInstant(Instant instant, String defaultValue) {
        return instant != null ? ISO_INSTANT_FORMATTER.format(instant) : defaultValue;
    }

    /**
     * Format a LocalDate to ISO-8601 string format with default value
     *
     * @param date         the LocalDate to format, can be null
     * @param defaultValue the value to return if date is null
     * @return formatted string or defaultValue if input is null
     */
    public static String formatLocalDate(LocalDate date, String defaultValue) {
        return date != null ? ISO_LOCAL_DATE_FORMATTER.format(date) : defaultValue;
    }

    /**
     * Convert a LocalDate to Instant representing the start of the day in user's timezone
     *
     * @param date the LocalDate to convert, can be null
     * @return Instant representing start of day or null if input is null
     */
    public static Instant toStartOfDayInstant(LocalDate date) {
        if (date == null) return null;

        ZoneId userZone = TimezoneContext.getTimezone();
        return date.atStartOfDay(userZone).toInstant();
    }

    /**
     * Convert a LocalDate to Instant representing the start of the day in user's timezone
     *
     * @param date the LocalDate to convert, can be null
     * @return Instant representing start of day or null if input is null
     */
    public static Instant toEndOfDayInstant(LocalDate date) {
        if (date == null) return null;

        ZoneId userZone = TimezoneContext.getTimezone();
        return date.atStartOfDay(userZone).toInstant().truncatedTo(ChronoUnit.SECONDS);
    }

}