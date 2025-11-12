package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user", schema = "bo_account")
public class UserCustomer {

    @Id
    @Column("id")
    private Integer idUser;

    @Column("name")
    private String name;

    @Column("lastname")
    @JsonAlias({"lastname"})
    private String lastName;

    @Column("birthdate")
    @JsonAlias({"birthDate"})
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime birthdate;

    @Column("gender")
    private String gender;

    @Column("idnationality")
    @JsonAlias({"idNationality","idnationality"})
    private Integer idNationality;

    @Column("email")
    private String email;

    @Column("nrodocument")
    @JsonAlias({"ndocument","nDocument","document","documentNumber"})
    private String nroDocument;

    @Column("districtaddress")
    @JsonAlias({"districtAddress","districtaddress"})
    private String districtAddress;

    @Column("address")
    private String address;

    @Column("username")
    @JsonAlias({"username"})
    private String userName;

    @Column("password")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column("idresidencecountry")
    @JsonAlias({"idResidenceCountry","idresidencecountry"})
    private Integer idResidenceCountry;

    @Column("civilstate")
    @JsonAlias({"civilstate","civilState"})
    private String civilState;

    @Column("booldelete")
    private Integer boolDelete;

    @Column("nrophone")
    @JsonAlias({"nroPhone","nrophone"})
    private String nroPhone;

    @Column("iddocument")
    @JsonAlias({"idDocument","iddocument"})
    private Integer idDocument;

    @Column("idstate")
    @JsonAlias({"idstate","idState"})
    private Integer idState;           

    @Column("createdate")
    @JsonAlias({"createDate","createdate"})
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;     

    @Column("profilepicture")
    @JsonAlias({"profilePicture","profilepicture"})
    private String profilePicture;

    @Column("code")
    private String code;
}
