package world.inclub.bonusesrewards.shared.infrastructure.context;

import java.time.ZoneId;

/**
 * Context holder for timezone information throughout the request lifecycle.
 */
public final class TimezoneContext {

    private static final String DEFAULT_TIMEZONE = "America/Lima";

    private TimezoneContext() {
        // Utility class - private constructor
    }

    /**
     * Gets the timezone
     *
     * @return the timezone
     */
    public static ZoneId getTimezone() {
        return ZoneId.of(DEFAULT_TIMEZONE);
    }

    /**
     * Gets the default timezone (Lima)
     *
     * @return the default timezone (America/Lima)
     */
    public static ZoneId getDefaultTimezone() {
        return ZoneId.of(DEFAULT_TIMEZONE);
    }

}