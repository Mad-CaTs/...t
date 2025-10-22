package world.inclub.membershippayment.infraestructure.config.kafka.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipMultiCodeDTO {
    private Integer parentId;
    private Integer childId;
    private Integer idMembership;
}
