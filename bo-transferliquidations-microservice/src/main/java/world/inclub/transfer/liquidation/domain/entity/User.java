package world.inclub.transfer.liquidation.domain.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.transfer.liquidation.domain.enums.State;

import java.time.LocalDateTime;

@Data
@Table(name = "user", schema = "bo_account")
public class User {
    @Id
    private Integer id;
    private String username;
    @Column("name")
    private String name;
    @Column("lastname")
    private String lastName;
    @Column("createdate")
    private LocalDateTime createDate;
    @Column("idstate")
    private State idState;
    @Column("is_promoter")
    private Boolean isPromoter;
}