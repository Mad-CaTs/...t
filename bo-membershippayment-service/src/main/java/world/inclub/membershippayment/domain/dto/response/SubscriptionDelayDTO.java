package world.inclub.membershippayment.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDelayDTO {

    @Column("days")
    private Integer daysToAnnualLiquidation;

    @Column("liquidation_date")
    private LocalDateTime liquidationDate;

    @Column("status")
    private Integer status;

}
