package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class UsersEntity {
    @Id
    @Column("id")
    private Integer id;

    @Column("email")
    private String email;

    @Column("password")
    private String password;

    @Column("sponsor")
    private String sponsor;

    @Column("sponsor_id")
    private Integer sponsorId;

    @Column("first_name")
    private String firstName;

    @Column("last_name")
    private String lastName;

    @Column("country")
    private String country;

    @Column("phone")
    private String phone;

    @Column("document_type_id")
    private Integer documentTypeId;

    @Column("document_number")
    private String documentNumber;

    @Column("promotions")
    private Boolean promotions;

    @Column("status")
    private Boolean status;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("username")
    private String username;

    @Column("nationality")
    private String nationality;

    @Column("district")
    private String district;

    @Column("gender")
    private String gender;

    @Column("birth_date")
    private LocalDate birthDate;

    @Column("address")
    private String address;
}