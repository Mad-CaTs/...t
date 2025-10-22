package world.inclub.membershippayment.domain.dto.response;
import lombok.Data;


@Data
public class MovementHistoryDTO {
    private String information;
    private String membership;
    private String portfolio;
    private String points;
    private String status;
    private String date;
}
