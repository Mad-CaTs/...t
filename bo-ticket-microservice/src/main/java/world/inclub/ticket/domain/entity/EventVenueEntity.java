package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("EventVenue")
public class EventVenueEntity {
    @Id
    @Column("VenueId")
    private Integer venueId;

    @Column("NameVenue")
    private String nameVenue;

    @Column("Country")
    private String country;

    @Column("City")
    private String city;

    @Column("Address")
    private String address;

    @Column("Latitude")
    private String latitude;

    @Column("Longitude")
    private String longitude;

    @Column("Status")
    private Boolean status;

    @Column("CreatedAt")
    private LocalDateTime createdAt;

    @Column("UpdatedAt")
    private LocalDateTime updatedAt;

    @Column("CreatedBy")
    private UUID createdBy;

    @Column("UpdatedBy")
    private UUID updatedBy;
}