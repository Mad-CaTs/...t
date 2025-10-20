package world.inclub.appnotification.infraestructure.security.enumeration;

import lombok.Getter;
import world.inclub.appnotification.infraestructure.security.dto.KeolaSecurityDtoStatus;

@Getter
public enum KeolaStatusEnum {

    OK("0000", "Proceso exitoso.")
    , ERROR("9000", "Error Interno del Servidor.")
    , FORBIDDEN("9001", "Usuario no identificado.");

    final KeolaSecurityDtoStatus status;

    private KeolaStatusEnum(String code, String msg) {
        status = new KeolaSecurityDtoStatus(code, msg);
    }

}
