package world.inclub.ticket.infraestructure.config.constants;

/**
 * Constantes globales del sistema
 * Ubicadas en infrastructure layer para configuraciones del sistema
 */
public final class Constants {
    
    /**
     * Constantes relacionadas con el procesamiento de pagos
     */
    public static final class Payment {
        /**
         * Tiempo en minutos que tiene el usuario para modificar un pago rechazado
         * antes de que se finalice automáticamente
         */
        public static final int MODIFICATION_WINDOW_MINUTES = 30; // 30 minutos para pruebas
        
        /**
         * Constructor privado para evitar instanciación
         */
        private Payment() {
            throw new UnsupportedOperationException("Esta clase no debe ser instanciada");
        }
    }
    
    /**
     * Constructor privado para evitar instanciación
     */
    private Constants() {
        throw new UnsupportedOperationException("Esta clase no debe ser instanciada");
    }
}
