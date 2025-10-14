package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class TicketTypeRequestDTO {
    private String ticketTypeName;
    private Boolean status;
}