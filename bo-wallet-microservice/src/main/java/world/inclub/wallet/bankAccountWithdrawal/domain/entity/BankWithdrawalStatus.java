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
@Table(name = DatabaseConstants.BANK_WITHDRAWAL_STATUS, schema = DatabaseConstants.SCHEMA_NAME)
public class BankWithdrawalStatus {

    @Id
    @Column("id")
    private Long id;

    @Column("name")
    private String name;

    @Column("background_color")
    private String backgroundColor;

    @Column("font_color")
    private String fontColor;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}
