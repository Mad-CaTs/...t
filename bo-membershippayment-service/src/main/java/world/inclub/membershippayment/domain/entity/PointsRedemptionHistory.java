package world.inclub.membershippayment.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "points_redemption_history", schema = "bo_membership")
public class PointsRedemptionHistory {

    @Id
    private Long id;

    @Column("id_user")
    private Integer idUser;

    @Column("redemption_type")
    private String redemptionType;

    @Column("redemption_code")
    private String redemptionCode;

    @Column("service_type")
    private String serviceType;

    @Column("description")
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column("usage_date")
    private LocalDate usageDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column("check_in_date")
    private LocalDate checkInDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column("check_out_date")
    private LocalDate checkOutDate;

    @Column("rewards")
    private Integer rewards;

    @Column("used_points")
    private Integer usedPoints;
}