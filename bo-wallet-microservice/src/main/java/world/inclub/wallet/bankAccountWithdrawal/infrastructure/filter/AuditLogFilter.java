package world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogFilter {
    private Integer type;
    private String search;
    private LocalDateTime createDate;
    private List<Integer> periodId;
    private Long actionId;
    private int page;
    private int size;
}
