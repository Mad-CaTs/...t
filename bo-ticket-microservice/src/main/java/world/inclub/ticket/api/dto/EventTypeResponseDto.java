package world.inclub.ticket.api.dto;

import lombok.Data;

/**
 * DTO para responder al cliente con los datos de un tipo de evento.
 * Este objeto se usa principalmente para peticiones GET.
 * Solo incluye la información relevante para el frontend,
 * ocultando los campos de auditoría y sistema.
 */
@Data
public class EventTypeResponseDto {
    private Integer eventTypeId;
    /**
     * Nombre del tipo de evento.
     */
    private String eventTypeName;

    /**
     * Estado lógico del tipo de evento (activo/inactivo).
     */
    private Boolean status;
}
