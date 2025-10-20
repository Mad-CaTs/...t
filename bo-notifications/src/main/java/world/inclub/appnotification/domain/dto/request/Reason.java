package world.inclub.appnotification.domain.dto.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reason {
    private int idReason;

    private String  reasonRejection;

    private String  detail;

    private int typeReason;
}
