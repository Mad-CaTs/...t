package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class SeatTypeRequestDto {
    private String seatTypeName;
    private Boolean status;
}