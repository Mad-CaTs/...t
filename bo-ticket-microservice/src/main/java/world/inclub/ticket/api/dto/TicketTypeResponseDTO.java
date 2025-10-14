package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class TicketTypeResponseDTO {
    private Integer ticketTypeId;
    private String ticketTypeName;
    private Boolean status;
}