package world.inclub.appnotification.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Column;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDelayDTO {

    @Column("idsubscription")
    private Long idSubscription;

    @Column("total_days")
    private Integer totalDays;

    @Column("id")
    private Integer idUser;

    @Column("name")
    private String name;

    @Column("lastname")
    private String lastName;

    @Column("username")
    private String userName;

    @Column("nrotelf")
    private String phoneNumber;

    @Column("email")
    private String email;

}
