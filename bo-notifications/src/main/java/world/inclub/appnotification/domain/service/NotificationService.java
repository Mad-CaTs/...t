package world.inclub.appnotification.domain.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.application.usecases.INotificationService;
import world.inclub.appnotification.domain.constant.NotificationConstant;
import world.inclub.appnotification.domain.dto.request.NotificationRequestDTO;
import world.inclub.appnotification.domain.dto.resposne.NotificationResponse;
import world.inclub.appnotification.domain.port.INotificationPort;
import world.inclub.appnotification.infraestructure.converter.NotificationConverter;
import world.inclub.appnotification.infraestructure.entity.Notification;

@Service
public class NotificationService implements INotificationService {

    private final INotificationPort notificationPort;

    private final NotificationConverter notificationConverter;

    public NotificationService(INotificationPort notificationPort, NotificationConverter notificationConverter) {
        this.notificationPort = notificationPort;
        this.notificationConverter = notificationConverter;
    }

    @Override
    public Mono<NotificationResponse> saveNotificationUser(String correo) {
        NotificationRequestDTO notificationRequestDTO = new NotificationRequestDTO();
        notificationRequestDTO.setUsuarioDestino(correo);
        notificationRequestDTO.setMensaje(NotificationConstant.UsuarioMensajeCreado);
        notificationRequestDTO.setTipoNotificacion(NotificationConstant.TipoUsuario);
        Notification notificationEntity = notificationConverter.toNotificationEntity(notificationRequestDTO);
        return notificationPort.saveNotification(notificationEntity)
                .map(notificationConverter::toNotificationResponseDTO);
    }

    @Override
    public Mono<NotificationResponse> saveNotification(String correo) {
        NotificationRequestDTO notificationRequestDTO = new NotificationRequestDTO();
        notificationRequestDTO.setUsuarioDestino(correo);
        notificationRequestDTO.setMensaje(NotificationConstant.AsuntoCorreo);
        notificationRequestDTO.setTipoNotificacion(NotificationConstant.TipoUsuario);
        Notification notificationEntity = notificationConverter.toNotificationEntity(notificationRequestDTO);
        return notificationPort.saveNotification(notificationEntity)
                .map(notificationConverter::toNotificationResponseDTO);
    }
}