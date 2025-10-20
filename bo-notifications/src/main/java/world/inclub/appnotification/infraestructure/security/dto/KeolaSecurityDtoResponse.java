package world.inclub.appnotification.infraestructure.security.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KeolaSecurityDtoResponse<T> {
    private KeolaSecurityDtoStatus status;
    private T data;
}
