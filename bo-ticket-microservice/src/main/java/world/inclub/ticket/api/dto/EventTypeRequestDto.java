package world.inclub.ticket.api.dto;

import lombok.Data;
/**
 * DTO para crear o ctualizar un tipo de evento.
 * Campos enviados desde el cliente
 */
@Data
public class EventTypeRequestDto {
    /**
     * Nombre del tipo de evento (requerido).
     */
    private String eventTypeName;
    /**
     * Estado lógico del tipo de evento  (requerido).
     */
    private Boolean status;
}
