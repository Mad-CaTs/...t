package world.inclub.ticket.infraestructure.client.dto;

import java.time.LocalDateTime;

public record DataResponse<T> (

    boolean result,
    T data,
    LocalDateTime timestamp,
    int status

) {}
