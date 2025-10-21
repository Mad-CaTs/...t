package world.inclub.wallet.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = DatabaseConstants.TRANSACTIONPAYPAL_TABLE, schema= DatabaseConstants.SCHEMA_NAME)
public class TransactionPaypal {

    @Column("transaction_id")
    private Long transactionId;

    @Column("operation_number")
    private String operationNumber;

    @Column("created_at")
    private Timestamp createdAt;

    @Column("updated_at")
    private Timestamp updatedAt;

    public TransactionPaypal(Long transactionId, String operationNumber) {
        ZoneId zoneId = ZoneId.of("America/Lima");
        ZonedDateTime dateUtc5 = ZonedDateTime.now(zoneId);

        this.transactionId = transactionId;
        this.operationNumber = operationNumber;
        this.createdAt = Timestamp.valueOf(dateUtc5.toLocalDateTime());
        this.updatedAt = Timestamp.valueOf(dateUtc5.toLocalDateTime());
    }

}
