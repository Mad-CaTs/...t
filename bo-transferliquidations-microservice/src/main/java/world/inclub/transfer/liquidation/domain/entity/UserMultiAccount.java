package world.inclub.transfer.liquidation.domain.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_multi_account", schema = "bo_account")
public class UserMultiAccount {

    @Id
    @Column("id_multi_account")
    private Integer idMultiAccount;

    @Column("parent_id")
    private Long parentId;

    @Column("child_id")
    private Long childId;

    @Column("sub_account_number")
    private Integer subAccountNumber;

    @Column("created_at")
    private LocalDateTime createdAt;
}
