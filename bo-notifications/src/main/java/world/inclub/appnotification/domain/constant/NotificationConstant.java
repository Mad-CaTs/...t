package world.inclub.appnotification.domain.constant;

public class NotificationConstant {
    public static final String API_BASE_PATH = "/api/v1/";

    public static final String correoMaster="notificaciones.inclub@gmail.com";

    public static final String NAME_SERVICE_ACCOUNT = "notification";

    public static final String TEST = "The %s field should not be blank";

    public static final String UsuarioMensajeCreado = "Notificacion Registro Usuario Enviado";
    public static final String TipoUsuario = "USUARIO";

    public static final String AsuntoCorreoUsuario = "Creacion de Usuario";

    public static final String AsuntoEnvioDocumentacion = "Envio de documentacion";

    public static final String AsuntoPagoAceptado = "Gracias por su pago";

    public static final String AsuntocambioTipodePago= "Notificación Inclub";

    public static final String AsuntoCorreoCotizacionPagada = "Cotización Pagada y Voucher Enviado";

    public static final String AsuntoCorreoPagoPosterior = "Pago Posterior Pendiente";

    public static final String AsuntoCorreoAlertaSponsor = "Alerta de Patrocinador";

    public static final String AsuntoCorreo = "Notificación";

    // ANNUAL LIQUIDATION
    public static final String ASUNTO_ANNUAL_LIQUIDATION_7_MONTHS = "7 meses de deuda - Estás más cerca de la liquidación anual";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_8_MONTHS = "8 meses sin pagar - Tu membresía esta en cuenta regresiva";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_9_MONTHS = "9 meses acumulados - ¡Queda poco para la liquidación anual!";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_10_MONTHS = "¡Atención! Solo 2 meses para evitar tu liquidación anual automática";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_11_MONTHS = "Tu cuenta podría entrar el liquidación en 1 mes";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_15_DAYS = "Faltan 15 días para la liquidación de tu cuenta";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_7_DAYS = "Faltan 7 días para la liquidación de tu cuenta";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_3_DAYS = "Faltan 3 días para la liquidación de tu cuenta";
    public static final String ASUNTO_ANNUAL_LIQUIDATION_0_DAYS = "Hoy vence el plazo para evitar la liquidación de tu cuenta";
    public static final String ASUNTO_ANNUAL_LIQUIDATION = "Su membresía ha sido liquidada";

    public static final String MESSAGE_7_MONTHS = "Con <strong>7 meses de cuotas con deuda</strong> tu cuenta sigue en riesgo de ser liquidada anualmente.";
    public static final String MESSAGE_8_MONTHS = "Tu cuenta acumular <strong>8 meses sin pago.</strong> Recuerda que si llegas a los 12 meses, se aplicará la liquidación anual automática.";
    public static final String MESSAGE_9_MONTHS = "Estás muy cerca del límite de 12 meses de deuda. Actualmente registras <strong>9 meses sin pagar.</strong>";
    public static final String MESSAGE_10_MONTHS = "Has acumulado <strong>10 meses de deuda</strong>. Si no regularizas pornto, tu cuenta será liquidada automáticamente al cumplir 12 meses.";
    public static final String MESSAGE_11_MONTHS = "Hemos detectado que acumulas <strong>11 meses sin pago</strong> de tus cuotas. De continuar así, tu cuenta será <strong>liquidada automáticamente</strong> en 30 días, conforme al proceso de <strong>preliquidación</strong> por acumulación de mora.";
    public static final String MESSAGE_15_DAYS = "Te recordamos que tu cuenta registra <strong>12 meses acumulados sin pago</strong>. De no regularizar tu situación en los próximos 15 días, tu membresía será <strong>liquidada automáticamente</strong>.";
    public static final String MESSAGE_7_DAYS = "Este es un recordatorio importante: tu cuenta será <strong>liquidada en solo 7 días</strong>, debido a 12 meses acumulados de deuda en tus cuotas.";
    public static final String MESSAGE_3_DAYS = "Este es el <strong>último aviso previo a la liquidación de tu cuenta</strong>. por cuotas impagadas. <strong>Solo quedan 3 días</strong> para evitar la liquidación de tu membresía.";
    public static final String MESSAGE_0_DAYS = "Hoy es el <strong>último día para evitar la liquidación automática</strong> de tu cuenta por acumulación de 12 meses sin pago de tus cuotas.";
    public static final String MESSAGE_ANNUAL_LIQUIDATION = "<p>De acuerdo con nuestras políticas, su cuenta <strong>ha sido liquidada</strong> por haber <strong>acumulado 12 meses</strong> de cuotas sin pagar.</p><p>Lamentamos informarle que, como consecuencia de esta liquidación, <strong>ha perdido la red patrocinio que tenía activa.</strong></p><p>Si desea <strong>reactivar su cuenta</strong> y acceder nuevamente a los beneficios, será necesario <strong>regularizar la totalidad de los pagos pendientes</strong>. Una vez hecho esto, podrá recuperar su acceso, aunque no será posible restablecer la red de patrocinio anterior.</p>";

    public static final class ErrorMessages {

        public static final String MALFORMED_JSON_REQUEST = "Malformed JSON request";
        public static final String WRITABLE_ERROR = "Error writing JSON output";
        public static final String METHOD_NOT_FOUND = "Could not find the %s method for URL %s";
        public static final String DATABASE_ERROR = "Database error";
        public static final String VALIDATION_MESSAGE = "Validation error. Check 'errors' field for details.";

        private ErrorMessages() {
            throw new AssertionError("ErrorMessages class should not be instantiated.");
        }
    }
    public static final class DB {
        public static final String SCHEMA = "bo_notifications";
        private DB() {
            throw new AssertionError("DB class should not be instantiated.");
        }
    }

    public static final class ValidationMessages {
        public static final String NOT_BLANK_MESSAGE = "The name field should not be blank";



        private ValidationMessages() {
            throw new AssertionError("ValidationMessages class should not be instantiated.");
        }
    }
}
