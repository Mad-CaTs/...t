package world.inclub.ticket.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EventStatus {

    ACTIVE("active"),
    INACTIVE("inactive");

    private final String name;
}
