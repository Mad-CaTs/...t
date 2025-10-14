package world.inclub.bonusesrewards.shared.infrastructure.webclient;

import java.time.LocalDateTime;

public record DataResponse<T>(
        Boolean result,
        T data,
        LocalDateTime timestamp,
        Integer status
) {}
