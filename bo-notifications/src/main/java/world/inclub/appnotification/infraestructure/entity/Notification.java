package world.inclub.appnotification.infraestructure.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.appnotification.domain.constant.NotificationConstant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications", schema = NotificationConstant.DB.SCHEMA)
public class Notification {

    @Id
    @Column("id")
    private Long idNotification;

    @Column("tiponotificacion")
    private String tipoNotificacion;

    private String mensaje;

    @Column("fechacreacion")
    private LocalDateTime fechaCreacion;

    @Column("usuariodestino")
    private String usuarioDestino;
}