package world.inclub.wallet.bankAccountWithdrawal.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = DatabaseConstants.AUDIT_LOG, schema = DatabaseConstants.SCHEMA_NAME)
public class AuditLogEntity {

    @Id
    @Column("id")
    private Long id;

    @Column("createdate")
    private LocalDateTime createDate;

    @Column("useradmin_id")
    private Long userAdminId;

    @Column("role")
    private String role;

    @Column("type")
    private Integer type;

    @Column("idsolicitudebank")
    private Long idSolicitudBank;

    @Column("file_name")
    private String fileName;

    @Column("records_count")
    private Integer recordsCount;

    @Column("size")
    private String size;

    @Column("action_id")
    private Long actionId;

}
