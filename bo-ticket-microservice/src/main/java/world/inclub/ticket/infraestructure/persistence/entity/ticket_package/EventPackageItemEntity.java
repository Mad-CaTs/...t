package world.inclub.ticket.infraestructure.persistence.entity.ticket_package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "event_package_item")
public class EventPackageItemEntity {

    @Id
    @Column("event_package_item_id")
    private Long eventPackageItemId;

    @Column("ticket_package_id")
    private Long ticketPackageId;

    @Column("event_zone_id")
    private Long eventZoneId;

    @Column("quantity")
    private Integer quantity;

    @Column("quantity_free")
    private Integer quantityFree;
}
