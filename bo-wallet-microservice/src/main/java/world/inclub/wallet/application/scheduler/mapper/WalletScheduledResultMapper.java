package world.inclub.wallet.application.scheduler.mapper;

import world.inclub.wallet.application.scheduler.WalletScheduledResult;

import java.time.Duration;
import java.time.LocalDateTime;

public class WalletScheduledResultMapper {

    public static WalletScheduledResult toSuccessResult(
            LocalDateTime startTime,
            LocalDateTime endTime,
            int totalProcessed,
            int totalUpdated,
            int totalNoChanges,
            int totalErrors) {

        Duration duration = Duration.between(startTime, endTime);

        return WalletScheduledResult.builder()
                .startTime(startTime)
                .endTime(endTime)
                .duration(duration)
                .totalProcessed(totalProcessed)
                .totalUpdated(totalUpdated)
                .totalNoChanges(totalNoChanges)
                .totalErrors(totalErrors)
                .build();
    }

    public static WalletScheduledResult toErrorResult(
            LocalDateTime startTime,
            LocalDateTime endTime,
            int totalProcessed,
            int totalUpdated,
            int totalNoChanges,
            int totalErrors,
            String criticalError) {

        Duration duration = Duration.between(startTime, endTime);

        return WalletScheduledResult.builder()
                .startTime(startTime)
                .endTime(endTime)
                .duration(duration)
                .totalProcessed(totalProcessed)
                .totalUpdated(totalUpdated)
                .totalNoChanges(totalNoChanges)
                .totalErrors(totalErrors)
                .criticalError(criticalError)
                .build();
    }
}
