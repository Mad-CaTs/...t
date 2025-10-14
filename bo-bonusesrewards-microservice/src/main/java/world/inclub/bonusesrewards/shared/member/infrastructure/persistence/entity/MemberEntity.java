package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

import static world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants.ACCOUNT_SCHEMA;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table (name = "user", schema = ACCOUNT_SCHEMA)
public class MemberEntity {

    @Id
    @Column("id")
    private Long id;

    @Column("name")
    private String name;

    @Column("lastname")
    private String lastName;

    @Column("birthdate")
    private LocalDate birthDate;

    @Column("gender")
    private char gender;

    @Column("email")
    private String email;

    @Column("username")
    private String username;

    @Column("password")
    private String password;

    @Column("nrotelf")
    private String phoneNumber;

    @Column("address")
    private String address;

    @Column("districtaddress")
    private String district;

    @Column("idnationality")
    private Long nationalityId;

    @Column("idresidencecountry")
    private Long residenceCountryId;

    @Column("iddocument")
    private Long documentTypeId;

    @Column("nrodocument")
    private String documentNumber;

    @Column("civilstate")
    private String maritalStatus;

    @Column("idstate")
    private Long stateId;

    @Column("is_promoter")
    private Boolean isPromoter;

}
