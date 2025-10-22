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
@Table(name = "state", schema = "bo_membership")
public class State implements Persistable<Long> {
    @Id
    private Long idState;
    private String nameEstate;
    private String code;
    private String colorRgb;

    @Override
    public Long getId() {
        return idState;
    }

    @Override
    public boolean isNew() {
        return idState == null || idState == 0;
    }
}
