package world.inclub.membershippayment.domain.entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "points_exchange_history", schema = "bo_membership")
public class PointsExchangeHistory {

    @Id
    @Column("idmovementexchangehistory")
    private Long idMovementExchangeHistory;

    @Column("idsuscription")
    private Long idSuscription;

    @Column("iduser")
    private Integer idUser;

    @Column("movementdate")
    private LocalDateTime movementDate;

    @Column("rewards")
    private Integer rewards;

    @Column("pointsused")
    private Integer pointsUsed;

    @Column("membership")
    private String membership;

    @Column("portfolio")
    private String portfolio;

    @Column("observation")
    private String observation;
}
