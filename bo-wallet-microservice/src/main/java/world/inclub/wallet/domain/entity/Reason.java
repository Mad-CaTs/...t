package world.inclub.wallet.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = DatabaseConstants.REASON_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class Reason {

    @Id
    @Column("id")
    private Long id;

    @Column("code")
    private String code;

    @Column("description")
    private String description;

    @Column("is_active")
    private boolean status;

    public Reason(String code, String description, boolean status) {
        this.code = code;
        this.description = description;
        this.status = status;
    }
}
