package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class SeatTypeResponseDTO {
    private Integer seatTypeId;
    private String seatTypeName;
    private Boolean status;
}