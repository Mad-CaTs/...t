package world.inclub.transfer.liquidation.domain.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transfer_rejection", schema = DatabaseConstants.SCHEMA_NAME)
public class TransferRejection {

    @Id
    @Column("id_transfer_rejection")
    private Integer id;

    @Column("id_transfer_request")
    private Integer idTransferRequest;

    @Column("id_transfer_rejection_type")
    private Integer idTransferRejectionType;

    @Column("detail_rejection_transfer")
    private String detailRejectionTransfer;

    @Column("rejected_transfer_at")
    private LocalDateTime rejectedTransferAt;
}
