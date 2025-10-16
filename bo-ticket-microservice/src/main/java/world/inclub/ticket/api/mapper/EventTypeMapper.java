package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.EventTypeRequestDto;
import world.inclub.ticket.domain.model.EventType;
import world.inclub.ticket.domain.entity.EventTypeEntity;
import world.inclub.ticket.api.dto.EventTypeResponseDto;
/**
 * Mapper manual para convertir entre capas.
 */

@Component
public class EventTypeMapper {

    /**
     * Convierte una entidad de base de datos en un modelo de dominio.
     *
     * @param entity la entidad persistente (EventTypeEntity)
     * @return un modelo de dominio EventType
     */
    public EventType toDomain(EventTypeEntity entity){
        if(entity == null) return null;

        return EventType.builder()
                .eventTypeId(entity.getEventTypeId())
                .eventTypeName(entity.getEventTypeName())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    /**
     * Convierte un modelo de dominio en una entidad persistente.
     *
     * @param domain el modelo de dominio EventType
     * @return la entidad persistente correspondiente
     */
    public EventTypeEntity toEntity(EventType domain) {
        if (domain == null) return null;

        return EventTypeEntity.builder()
                .eventTypeId(domain.getEventTypeId())
                .eventTypeName(domain.getEventTypeName())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }

    /**
     * Convierte un DTO de entrada (request) en un modelo de dominio.
     * El backend será responsable de completar los campos de auditoría.
     *
     * @param dto el DTO con datos enviados por el cliente
     * @return un modelo de dominio listo para ser persistido o procesado
     */
    public EventType toDomain(EventTypeRequestDto dto) {
        if (dto == null) return null;

        return EventType.builder()
                .eventTypeName(dto.getEventTypeName())
                .status(dto.getStatus())
                .build();
    }

    /**
     * Convierte un modelo de dominio en un DTO de salida para el cliente.
     * Este DTO está diseñado para exponer solo la información necesaria.
     *
     * @param domain el modelo de dominio
     * @return DTO de respuesta con datos visibles por el frontend
     */
    public EventTypeResponseDto toResponseDto(EventType domain) {
        if (domain == null) return null;

        EventTypeResponseDto response = new EventTypeResponseDto();
        response.setEventTypeId(domain.getEventTypeId());
        response.setEventTypeName(domain.getEventTypeName());
        response.setStatus(domain.getStatus());
        return response;
    }
}
