package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transfer_old_user", schema = DatabaseConstants.SCHEMA_NAME)
public class TransferOldUser {

    @Id
    @Column("id_transfer_old_user")
    private Integer idTransferOldUser;

    @Column("id_transfer_request")
    private Integer idTransferRequest;

    @Column("name")
    private String name;

    @Column("lastname")
    private String lastName;

    @Column("birthdate")
    private LocalDateTime birthdate;

    @Column("gender")
    private String gender;

    @Column("nationality")
    private String nationality;

    @Column("email")
    private String email;

    @Column("nrodocument")
    private String nroDocument;

    @Column("phone")
    private String phone;

    @Column("country")
    private String country;

    @Column("district")
    private String district;

    @Column("address")
    private String address;

    @Column("marital_status")
    private String maritalStatus;
}
