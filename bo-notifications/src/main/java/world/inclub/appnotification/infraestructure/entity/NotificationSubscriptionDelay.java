package world.inclub.appnotification.infraestructure.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.appnotification.domain.constant.NotificationConstant;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications_subscription_delay", schema = NotificationConstant.DB.SCHEMA)
public class NotificationSubscriptionDelay {

    @Id
    @Column("idnotificationsubscriptiondelay")
    private Long idNotificationSubscriptionDelay;

    @Column("idsubscription")
    private Long idSubscription;

    @Column("idnotification")
    private Long idNotification;

    @Column("total_days")
    private Integer totalDays;

    @Column("notification_date")
    private LocalDateTime notificationDate;

    @Column("notification_type")
    private String notificationType;

}
