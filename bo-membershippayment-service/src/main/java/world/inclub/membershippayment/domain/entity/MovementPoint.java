package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "movementpoint", schema = "bo_membership")
public class MovementPoint {

    @Id
    @Column("idmovementpoint")
    private Long idMovement;

    @Column("idsuscription")
    private Long idSuscription;

    @Column("information")
    private String information;

    @Column("membership")
    private String membership;

    @Column("portfolio")
    private String portfolio;

    @Column("points")
    private Integer points;

    @Column("status")
    private String status;

    @Column("movementdate")
    private LocalDateTime movementDate;

    @Column("iduser")
    private Integer idUser;
}