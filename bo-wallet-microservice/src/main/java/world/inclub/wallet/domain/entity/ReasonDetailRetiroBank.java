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
@Table(name = "reasondetailretirobank", schema = DatabaseConstants.SCHEMA_NAME)
public class ReasonDetailRetiroBank {
    @Id
    @Column("idreasondetailretirobank")
    private Long idReasonDetailRetiroBank;

    @Column("idreasonretirobank")
    private Integer idReasonRetiroBank;

    @Column("iduser")
    private Integer idUser;

    @Column("detail")
    private String detail;
}
