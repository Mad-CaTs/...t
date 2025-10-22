package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DataResponse<T> {
    private boolean result;
    private T data;
    private LocalDateTime timestamp;
    private int status;
}
