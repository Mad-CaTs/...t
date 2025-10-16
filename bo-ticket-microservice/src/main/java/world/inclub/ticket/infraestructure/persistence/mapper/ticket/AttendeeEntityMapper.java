package world.inclub.ticket.infraestructure.persistence.mapper.ticket;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.AttendeeEntity;

@Component
public class AttendeeEntityMapper {

    public Attendee toDomain(AttendeeEntity entity) {
        return Attendee.builder()
                .id(entity.getId())
                .paymentId(entity.getPaymentId())
                .eventZoneId(entity.getEventZoneId())
                .email(entity.getEmail())
                .documentTypeId(entity.getDocumentTypeId())
                .documentNumber(entity.getDocumentNumber())
                .name(entity.getName())
                .lastName(entity.getLastName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public AttendeeEntity toEntity(Attendee domain) {
        return AttendeeEntity.builder()
                .id(domain.getId())
                .paymentId(domain.getPaymentId())
                .eventZoneId(domain.getEventZoneId())
                .email(domain.getEmail())
                .documentTypeId(domain.getDocumentTypeId())
                .documentNumber(domain.getDocumentNumber())
                .name(domain.getName())
                .lastName(domain.getLastName())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

}
