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
@Table(name = "transfer_observation", schema = DatabaseConstants.SCHEMA_NAME)
public class TransferObservation {

    @Id
    @Column("id_observation_transfer")
    private Integer id;

    @Column("id_transfer_observation_type")
    private Integer idTransferObservationType;

    @Column("detail_observation_transfer")
    private String detailObservationTransfer;

    @Column("observed_transfer_at")
    private LocalDateTime observedTransferAt;

    @Column("id_transfer_request")
    private Integer idTransferRequest;
}
