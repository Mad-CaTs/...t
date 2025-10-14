package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.TicketTypeRequestDTO;
import world.inclub.ticket.api.dto.TicketTypeResponseDTO;
import world.inclub.ticket.domain.model.TicketType;
import world.inclub.ticket.domain.entity.TicketTypeEntity;

@Component
public class TicketTypeMapper {
    public TicketType toDomain(TicketTypeEntity entity) {
        if(entity == null) return null;

        return TicketType.builder()
                .ticketTypeId(entity.getTicketTypeId())
                .ticketTypeName(entity.getTicketTypeName())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public TicketTypeEntity toEntity(TicketType domain) {
        if(domain == null) return null;

        return TicketTypeEntity.builder()
                .ticketTypeId(domain.getTicketTypeId())
                .ticketTypeName(domain.getTicketTypeName())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }

    public TicketType toDomain(TicketTypeRequestDTO dto){
        if(dto == null) return null;

        return TicketType.builder()
                .ticketTypeName(dto.getTicketTypeName())
                .status(dto.getStatus())
                .build();
    }

    public TicketTypeResponseDTO toResponseDTO(TicketType domain) {
        if(domain == null) return null;
        TicketTypeResponseDTO response = new TicketTypeResponseDTO();
        response.setTicketTypeId(domain.getTicketTypeId());
        response.setTicketTypeName(domain.getTicketTypeName());
        response.setStatus(domain.getStatus());
        return response;
    }
}