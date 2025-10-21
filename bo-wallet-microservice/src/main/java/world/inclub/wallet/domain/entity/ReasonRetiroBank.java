package world.inclub.wallet.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reasonretirobank", schema = DatabaseConstants.SCHEMA_NAME)
public class ReasonRetiroBank {
    @Id
    @Column("idreasonretirobank")
    private Long idReasonRetiroBank;

    @Column("title")
    private String title;

}