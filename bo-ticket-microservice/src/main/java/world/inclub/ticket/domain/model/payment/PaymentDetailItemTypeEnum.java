package world.inclub.ticket.domain.model.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PaymentDetailItemTypeEnum {

    ZONE(1L, "Zone"),
    PACKAGE(2L, "Package");

    private final Long id;
    private final String name;

}
