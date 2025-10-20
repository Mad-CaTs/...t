
package world.inclub.appnotification.infraestructure.security.jwt.exception;

import world.inclub.appnotification.infraestructure.security.jwt.enumerations.LoggerEnum;

public class TokenJwtException extends Exception
{

    private static final long serialVersionUID = 8709513315581218473L;
    
    private final String jwtId;
    private final LoggerEnum loggerEnum;

    public TokenJwtException(LoggerEnum loggerEnum, String jwtId, String message, Throwable exception)
    {
        super(message, exception);
        this.jwtId = jwtId;
        this.loggerEnum = loggerEnum;
    }

    public TokenJwtException(LoggerEnum loggerEnum, String jwtId)
    {
        super(loggerEnum.getMessage());
        this.jwtId = jwtId;
        this.loggerEnum = loggerEnum;
    }

    public TokenJwtException(LoggerEnum loggerEnum)
    {
        super(loggerEnum.getMessage());
        this.jwtId = "";
        this.loggerEnum = loggerEnum;
    }

    public TokenJwtException(LoggerEnum loggerEnum, Throwable e)
    {
        this(loggerEnum, loggerEnum.getMessage(), e);
    }
    
    public TokenJwtException(LoggerEnum loggerEnum, String message, Throwable exception)
    {
        this(loggerEnum, "", message, exception);
    }

    public String getJwtId()
    {
        return jwtId;
    }
    
    public LoggerEnum getLoggerEnum()
    {
        return loggerEnum;
    }

}
