package world.inclub.membershippayment.domain.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_rewards", schema = "bo_membership")
public class UserRewards {

    @Id
    private Long id;

    @Column("id_user")
    private Integer idUser;

    @Column("rewards")
    private Integer rewards;
}