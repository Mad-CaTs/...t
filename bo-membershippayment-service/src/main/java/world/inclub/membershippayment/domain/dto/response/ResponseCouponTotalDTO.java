package world.inclub.membershippayment.domain.dto.response;

import lombok.Builder;
import org.springframework.data.relational.core.mapping.Column;

@Builder
public record ResponseCouponTotalDTO(
        @Column("total_records")
        Integer totalRecords
) {
}
