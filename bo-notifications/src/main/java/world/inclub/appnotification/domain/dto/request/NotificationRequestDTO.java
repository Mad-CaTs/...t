package world.inclub.appnotification.domain.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.appnotification.domain.constant.NotificationConstant;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class    NotificationRequestDTO {

    @NotNull
    @NotBlank(message = NotificationConstant.ValidationMessages.NOT_BLANK_MESSAGE)
    private String tipoNotificacion;

    @NotNull
    @NotBlank(message = NotificationConstant.ValidationMessages.NOT_BLANK_MESSAGE)
    private String mensaje;

    @NotNull
    @NotBlank(message = NotificationConstant.ValidationMessages.NOT_BLANK_MESSAGE)
    private String usuarioDestino;

}