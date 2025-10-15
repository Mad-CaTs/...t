package world.inclub.bonusesrewards.shared.response;

import lombok.Builder;

@Builder
public record ApiResponse<T>(
        Boolean result,
        T data,
        String timestamp,
        Integer status
) {}

