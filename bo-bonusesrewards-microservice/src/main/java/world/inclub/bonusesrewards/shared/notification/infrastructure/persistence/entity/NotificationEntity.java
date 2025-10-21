package world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.schema.NotificationsSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.schema.NotificationsSchema.Table.NOTIFICATIONS_TABLE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = NOTIFICATIONS_TABLE, schema = SCHEMA)
public class NotificationEntity {

    @Id
    private UUID id;

    @Column("member_id")
    private Long memberId;

    @Column("type_id")
    private Long typeId;

    @Column("title")
    private String title;

    @Column("message")
    private String message;

    @Column("is_read")
    private Boolean isRead;

    @Column("created_at")
    private Instant createdAt;

    @Column("read_at")
    private Instant readAt;

}