package world.inclub.membershippayment.domain.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PointsExchangeHistoryResponseDTO {
    private Long idMovementExchangeHistory;

    private Integer idUser;

    private String movementDate;

    private Integer rewards;

    private Integer pointsUsed;

    private String portfolio;

    private String observation;
}
