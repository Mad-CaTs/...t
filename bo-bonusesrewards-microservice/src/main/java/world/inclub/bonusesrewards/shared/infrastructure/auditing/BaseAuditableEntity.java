package world.inclub.bonusesrewards.shared.infrastructure.auditing;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;

import java.time.Instant;

import static world.inclub.bonusesrewards.shared.infrastructure.auditing.AuditableColumns.*;

@Data
public abstract class BaseAuditableEntity {

    @CreatedDate
    @Column(COL_CREATED_AT)
    private Instant createdAt;

    @LastModifiedDate
    @Column(COL_UPDATED_AT)
    private Instant updatedAt;
}