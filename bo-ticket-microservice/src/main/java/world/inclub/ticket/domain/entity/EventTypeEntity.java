package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa la entidad persistente de EventType usada por Spring Data R2DBC.
 *
 * Esta clase está mapeada directamente a la tabla "EventType" de la base de datos.
 * Contiene las anotaciones necesarias para realizar operaciones reactivas con R2DBC.
 *
 * A diferencia del modelo de dominio, esta clase sí está acoplada a la infraestructura
 * y contiene las anotaciones necesarias para el acceso a datos.
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("EventType")
public class EventTypeEntity {
    /**
     * Clave primaria del tipo de evento (EventTypeId).
     */
    @Id
    @Column("EventTypeId")
    private Integer eventTypeId;

    /**
     * Nombre del tipo de evento (ej. "Concierto", "Taller", etc.).
     */
    @Column("EventTypeName")
    private String eventTypeName;

    /**
     * Estado lógico (activo/inactivo) del tipo de evento.
     */
    @Column("Status")
    private Boolean status;

    /**
     * Fecha de creación del registro (DEFAULT NOW()).
     */
    @Column("CreatedAt")
    private LocalDateTime createdAt;

    /**
     * Fecha de última modificación del registro.
     */
    @Column("UpdatedAt")
    private LocalDateTime updatedAt;

    /**
     * UUID del usuario que creó el registro.
     */
    @Column("CreatedBy")
    private UUID createdBy;

    /**
     * UUID del usuario que realizó la última modificación.
     */
    @Column("UpdatedBy")
    private UUID updatedBy;
}
