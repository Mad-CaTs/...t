package world.inclub.appnotification.infraestructure.security.jwt.enumerations;

public enum LoggerEnum
{
    TOTAL_NOT_MATCH_DETAIL("WS0001", "Monto Total como par\u00E1metro no coincide con lista detail enviado."),
    NOT_UPLOAD_PLAIN_FILE("WS0002", "Error en la subida de archivos planos."),
    NOT_DOWNLOAD_PLAIN_FILE("WS0003", "Error en la descarga de archivos planos."),
    READ_FILE_ERROR("RF0003", "Ocurri\u00F3 un error al leer el file."),
    READ_FILE_NOT_EXIST("RF0004", "El fichero no existe."),
    READ_FILE_EMPTY("RF0005", "El fichero esta vac\u00EDo."),
    READ_ZIP_ERROR("RF0006", "Ocurri\u00F3 un error al leer el zip."),
    READ_FILE_PATH_INVALID("RF0007", "La ruta ingresada es inv\u00E1lida."),
    READ_FILE_EXIST("RF0008", "El fichero ya existe."),
    CREATE_FILE_ERROR("RF0009", "El archivo no se pudo crear."),
    EXPORT_ERROR("EX0001", "Error al exportar."),
    EXPORT_EXTENSION_NOT_SUPPORT("EX0002", "Extensi\u00F3n no soportada."),
    EXPORT_TEMPLATE_ERROR("EX0003", "Error con el template."),
    EXPORT_GEN_TEMPLATE_ERROR("EX0004", "No se pudo generar autom\u00E1ticamente."),
    EXPORT_WRITE_ERROR_XLS("EX0005", "Error al escribir excel."),
    EXPORT_WRITE_ERROR_TXT("EX0006", "Error al escribir txt."),
    NOT_UPLOAD_TO_SERVICE("WEB0001", "Error en la subida de archivo a capa service."),
    PROCESS_ERROR("WS9999", "Ocurri\u00F3 un error inesperado."),
    INVALID_PATH("VAL001", "La ruta no es v\u00E1lido."),
    INVALID_JSON_PARSER("VAL002", "Error al parsear json.")
    , ERROR_CONFIG_VALIDATOR("CNF001", "Validator no se encuentra configurado.")
    , INVALID_PARSER("VAL002", "No se pudo parsear.")
    , JWT_SIGNATURE_INVALID("JWT002", "Firma de token inv\u00E1lida.")
    , JWT_REFRESH_TOKEN_NOTFOUND("JWT003", "No se encuentra refresh token en base de datos.")
    , JWT_APP_CLIENT_NOT_FOUND("JWT004", "El cliente no est\u00E1 registrado para usar el servicio.")
    , JWT_APP_CLIENT_INVALID("JWT005", "El cliente no est\u00E1 permitido para usar el servicio.")
    , JWT_APP_CLIENT_REFRESH_DISABLED("JWT006", "El cliente no tiene habilitado refrescar tokens.")
    , JWT_EXPIRED("JWT001", "Token expirado.")
    , TOKEN_ERROR("TKN001", "Error al validar token.")
    , MULTIPLE_SESSION_FOUND("JWT001", "Existe otra sesi�n encontrada.")
    , SFTP_REFUSED("FTP001", "[SFTP] Conexi\u00F3n rechazada.")
    , SFTP_LOST("FTP002", "[SFTP] Conexi\u00F3n perdida.")
    , DATA_QUEUE_EXCEPTION("DQ001", "[DQ] Error al leer dataqueue.")
    , UNAUTHENTICATED("AUTH001", "Usuario no autenticado.")
    , UNATHORIZED("AUTH002", "Usuario no autorizado.")
    ;
    
    private String code;
    private String message;
    
    LoggerEnum(String code, String message)
    {
        this.code = code;
        this.message = message;
    }
    
    public String getCode()
    {
        return code;
    }
    
    public String getMessage()
    {
        return message;
    }
    
    public String getMessageFormat() 
    {
        return String.format("%s: %s", this.getCode(), this.getMessage());
    }
    
    public String getMessageFormat(String comment) 
    {
        return String.format("%s: %s $%s !", this.getCode(), this.getMessage(), comment);
    }
    
    public String getMessageFormat(Throwable e) 
    {
        return String.format("%s: %s $ !%s", this.getCode(), this.getMessage(), e.getMessage());
    }
    
    public String getMessageFormat(String comment, Throwable e) 
    {
        return String.format("%s: %s $%s !%s", this.getCode(), this.getMessage(), comment, e.getMessage());
    }
    
}
