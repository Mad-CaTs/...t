package world.inclub.membershippayment.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PointsRedemptionHistoryRequest {

    private Integer idUser;
    private String redemptionType;
    private String redemptionCode;
    private String serviceType;
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate usageDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate checkInDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate checkOutDate;

    private Integer rewards;
    private Integer usedPoints;
}
