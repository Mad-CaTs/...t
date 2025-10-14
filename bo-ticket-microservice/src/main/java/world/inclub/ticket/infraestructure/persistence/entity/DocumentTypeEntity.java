package world.inclub.ticket.infraestructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documenttype")
public class DocumentTypeEntity {

    @Id
    @Column("id")
    private Integer id;

    @Column("name")
    private String name;

    @Column("idcountry")
    private Integer countryId;

}
