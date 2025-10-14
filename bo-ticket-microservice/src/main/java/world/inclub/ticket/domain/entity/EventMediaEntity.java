package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table("event_media")
public class EventMediaEntity {
    @Id
    @Column("mediaid")
    private Integer mediaId;

    @Column("eventid")
    private Integer eventId;

    @Column("imageurl")
    private String imageUrl;

    @Column("secondimageurl")
    private String secondImageUrl;

    @Column("videourl")
    private String videoUrl;

    @Column("createdat")
    private LocalDateTime createdAt;

    @Column("updatedat")
    private LocalDateTime updatedAt;
}