package world.inclub.ticket.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa el modelo de dominio para un tipo de evento (EventType) en el sistema de ticketing.
 *
 * Esta clase contiene información relevante sobre un tipo de evento, como su nombre, estado,
 * fechas de creación y actualización, y los identificadores de usuario que realizaron dichas acciones.
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventType {
    /**
     * Identificador único del tipo de evento.
     */
    private Integer eventTypeId;

    /**
     * Nombre del tipo de evento.
     */
    private String eventTypeName;

    /**
     * Indica si el tipo de evento está activo o no.
     */
    private Boolean status;

    /**
     * Fecha y hora de creación del registro.
     */
    private LocalDateTime createdAt;

    /**
     * Fecha y hora de la última actualización del registro.
     */
    private LocalDateTime updatedAt;

    /**
     * UUID del usuario que creó este registro.
     */
    private UUID createdBy;

    /**
     * UUID del usuario que actualizó por última vez este registro.
     */
    private UUID updatedBy;
}
