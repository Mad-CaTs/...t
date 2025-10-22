package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;

@Data
public class MovementPointRequest {
    private Long idSuscription;
    private String information;
    private String membership;
    private String portfolio;
    private Integer points;
    private String status;
    private Integer idUser;
}
