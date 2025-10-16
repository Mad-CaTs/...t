package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.SeatTypeRequestDto;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;
import world.inclub.ticket.domain.model.SeatType;
import world.inclub.ticket.domain.entity.SeatTypeEntity;

@Component
public class SeatTypeMapper {
    public SeatType toDomain(SeatTypeEntity entity) {
        if (entity == null) return null;
        return SeatType.builder()
                .seatTypeId(entity.getSeatTypeId())
                .seatTypeName(entity.getSeatTypeName())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public SeatTypeEntity toEntity(SeatType domain) {
        if (domain == null) return null;
        return SeatTypeEntity.builder()
                .seatTypeId(domain.getSeatTypeId())
                .seatTypeName(domain.getSeatTypeName())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }

    public SeatType toDomain(SeatTypeRequestDto dto) {
        if (dto == null) return null;
        return SeatType.builder()
                .seatTypeName(dto.getSeatTypeName())
                .status(dto.getStatus())
                .build();
    }

    public SeatTypeResponseDTO toResponseDto(SeatType domain) {
        if (domain == null) return null;
        SeatTypeResponseDTO response = new SeatTypeResponseDTO();
        response.setSeatTypeId(domain.getSeatTypeId());
        response.setSeatTypeName(domain.getSeatTypeName());
        response.setStatus(domain.getStatus());
        return response;
    }
}