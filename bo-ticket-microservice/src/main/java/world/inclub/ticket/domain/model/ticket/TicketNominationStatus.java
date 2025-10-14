package world.inclub.ticket.domain.model.ticket;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TicketNominationStatus {

    NOMINATED(1L, "Nominated"),
    NOT_NOMINATED(2L, "Not Nominated");

    private final Long id;
    private final String name;

    public static TicketNominationStatus fromId(Long id) {
        for (TicketNominationStatus status : values()) {
            if (status.getId().equals(id)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid TicketNominationStatus id: " + id);
    }

}
