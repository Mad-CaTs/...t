package world.inclub.appnotification.infraestructure.converter;

import org.springframework.stereotype.Component;
import world.inclub.appnotification.domain.dto.request.NotificationRequestDTO;
import world.inclub.appnotification.domain.dto.resposne.NotificationResponse;
import world.inclub.appnotification.infraestructure.entity.Notification;

import java.time.LocalDateTime;

@Component
public class NotificationConverter {

    public NotificationConverter() {
    }

    public Notification toNotificationEntity(NotificationRequestDTO dto) {
        Notification entity = new Notification();
        entity.setTipoNotificacion(dto.getTipoNotificacion());
        entity.setMensaje(dto.getMensaje());
        entity.setUsuarioDestino(dto.getUsuarioDestino());
        return entity;
    }

    public NotificationResponse toNotificationResponseDTO(Notification entity) {
        return new NotificationResponse(
                entity.getIdNotification(),
                entity.getTipoNotificacion(),
                entity.getMensaje(),
                entity.getUsuarioDestino()
        );
    }
}