package world.inclub.wallet.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElectronicPurseCompany {

    @Id
    @Column("idelectronicpursecompany")
    private Integer idElectronicPurseCompany;
    @Column("namecompany")
    private String nameCompany;
    @Column("abbreviation")
    private String abbreviation;

}
