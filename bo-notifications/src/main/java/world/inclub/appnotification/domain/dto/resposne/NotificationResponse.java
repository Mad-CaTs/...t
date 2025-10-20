package world.inclub.appnotification.domain.dto.resposne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private Long id;

    private String tipoNotificacion;

    private String mensaje;

    private String usuarioDestino;


}