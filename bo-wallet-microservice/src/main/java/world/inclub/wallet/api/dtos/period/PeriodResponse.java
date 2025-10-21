package world.inclub.wallet.api.dtos.period;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PeriodResponse {
    private Integer id;
    private List<Integer> initialDate;
    private List<Integer> endDate;
    private List<Integer> payDate;
    private Integer status;
    private Integer isActive;
    private List<Integer> creationDate;
}
