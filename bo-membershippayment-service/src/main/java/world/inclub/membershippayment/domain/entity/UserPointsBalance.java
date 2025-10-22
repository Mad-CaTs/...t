package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_points_balance", schema = "bo_membership")
public class UserPointsBalance {

    @Id
    @Column("id")
    private Long id;

    @Column("iduser")
    private Integer idUser;

    @Column("liberated_points")
    private Integer liberatedPoints;

    @Column("idfamily")
    private Integer idFamily;
}