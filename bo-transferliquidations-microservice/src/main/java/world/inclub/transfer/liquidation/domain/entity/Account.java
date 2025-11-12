package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "account", schema = "bo_account")
public class Account {

    @Id
    @Column("id_account")
    private Integer id;

    @Column("username")
    private String username;
    
    @Column("name")
    private String name;

    @Column("last_name")
    private String lastName;
}
