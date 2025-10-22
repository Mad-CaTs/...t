package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryResponse {
    private boolean result;
    private List<HistoryItemDTO> data;
    private String timestamp;
    private int status;
}