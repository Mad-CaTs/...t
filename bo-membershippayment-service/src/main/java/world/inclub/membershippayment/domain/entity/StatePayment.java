package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "statepayment", schema = "bo_membership")
public class StatePayment implements Persistable<Long> {
    @Id
    private Long id;
    private String nameState;

    @Override
    public boolean isNew() {
        return id == null || id == 0;
    }
}
