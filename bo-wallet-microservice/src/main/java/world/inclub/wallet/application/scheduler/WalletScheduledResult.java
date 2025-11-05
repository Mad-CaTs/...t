package world.inclub.wallet.application.scheduler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletScheduledResult {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Duration duration;
    private int totalProcessed;
    private int totalUpdated;
    private int totalNoChanges;
    private int totalErrors;
    private String criticalError;
}
