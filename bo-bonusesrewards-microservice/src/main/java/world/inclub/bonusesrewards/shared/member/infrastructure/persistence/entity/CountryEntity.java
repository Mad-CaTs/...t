package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import static world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants.ACCOUNT_SCHEMA;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "country", schema = ACCOUNT_SCHEMA)
public class CountryEntity {

    @Id
    @Column("idcountry")
    private Long id;

    @Column("iso")
    private String isoCode;

    @Column("name")
    private String name;

    @Column("nicename")
    private String displayName;

    @Column("iso3")
    private String iso3Code;

    @Column("numcode")
    private Integer numericCode;

    @Column("phonecode")
    private Integer phoneCode;

    @Column("symbol")
    private String phoneSymbol;

    @Column("courtesy")
    private String nationality;

}

