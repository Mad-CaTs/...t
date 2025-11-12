package world.inclub.transfer.liquidation.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Data;

@Data
@Table(schema = "bo_rewards", name = "rewards_suscription")
public class RewardsSuscription {
    @Id
    @Column("id_rewards_suscription")
    private Integer idRewardsSuscription;

    @Column("subscription_id")
    private Integer subscriptionId;

    @Column("user_id")
    private Integer userId;
}
