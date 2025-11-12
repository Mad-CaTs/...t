package world.inclub.transfer.liquidation.domain.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;
import com.fasterxml.jackson.annotation.JsonAlias;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Table(name = "transfer_request", schema = DatabaseConstants.SCHEMA_NAME)
public class TransferRequest {

    @Id
    @Column("id_transfer_request")
    private Integer idTransferRequest;

    @Column("id_transfer_type")
    private Integer idTransferType;

    @Column("id_membership")
    private Integer idMembership;

    @Column("id_user_from")
    private Integer idUserFrom;

    @Column("id_user_to")
    private Integer idUserTo;

    @Column("sponsor_id")
    private Integer sponsorId;

    @Column("id_transfer_status")
    private Integer idTransferStatus;

    @Column("request_date")
    private LocalDateTime requestDate;

    @Column("approval_date")
    private LocalDateTime approvalDate;

    @Column("completion_date")
    private LocalDateTime completionDate;

    @JsonAlias({"dni_solicitante", "dniSolicitante", "dni_url"})
    @Column("dni_url")
    private String dniUrl;

    @JsonAlias({"declaracion_jurada", "declaration_jurada", "declarationJurada", "decalaracion_jurada"})
    @Column("declaration_jurada_url")
    private String declarationJuradaUrl;

    @JsonAlias({"dni_receptor", "dniReceptor"})
    @Column("dni_receptor_url")
    private String dniReceptor;

    @JsonAlias({"user_to_nombre", "userToNombre", "userTo_name"})
    @Column("user_to_name")
    private String userToNombre;

    @JsonAlias({"user_to_apellido", "userToApellido", "userTo_last_name"})
    @Column("user_to_last_name")
    private String userToApellido;

    @JsonAlias({"user_to_numero_documento", "userToNumeroDocumento", "userTo_document_number"})
    @Column("user_to_document_number")
    private String userToNumeroDocumento;

    @JsonAlias({"user_to_tipo_documento", "userToTipoDocumento", "userTo_document_type"})
    @Column("user_to_document_type")
    private Integer userToTipoDocumento;

    @JsonAlias({"user_to_genero", "userToGenero", "userTo_gender"})
    @Column("user_to_gender")
    private String userToGenero;

    @JsonAlias({"user_to_fecha_nacimiento", "userToFechaNacimiento", "userTo_birthdate"})
    @Column("user_to_birth_date")
    private LocalDateTime userToFechaNacimiento;

    @JsonAlias({"user_to_estado_civil", "userToEstadoCivil", "userTo_marital_status"})
    @Column("user_to_civil_state")
    private String userToEstadoCivil;

    @JsonAlias({"user_to_nacionalidad", "userToNacionalidad", "userTo_nationality"})
    @Column("user_to_nationality")
    private Integer userToNacionalidad;

    @JsonAlias({"user_to_pais_residencia", "userToPaisResidencia", "userTo_residence_country"})
    @Column("user_to_country_of_residence")
    private Integer userToPaisResidencia;

    @JsonAlias({"user_to_distrito", "userToDistrito", "userTo_district"})
    @Column("user_to_district")
    private String userToDistrito;

    @JsonAlias({"user_to_provincia", "userToProvincia", "userTo_province"})
    @Column("user_to_province")
    private String userToProvincia;

    @JsonAlias({"user_to_direccion", "userToDireccion", "userTo_address"})
    @Column("user_to_address")
    private String userToDireccion;

    @JsonAlias({"user_to_correo_electronico", "userToCorreoElectronico", "userTo_email"})
    @Column("user_to_email")
    private String userToCorreoElectronico;

    @JsonAlias({"user_to_celular", "userToCelular", "userTo_phone"})
    @Column("user_to_phone")
    private String userToCelular;

    @JsonAlias({"user_from_nombre", "user_from_name", "userFromNombre", "user_from_name", "user_from_name"})
    @Column("user_from_name")
    private String userFromNombre;

    @JsonAlias({"user_from_email", "userFromCorreoElectronico", "userFromEmail", "user_from_email"})
    @Column("user_from_email")
    private String userFromCorreoElectronico;

    @JsonAlias({"sponsor_nombre", "sponsor_name", "sponsorNombre", "sponsor_name"})
    @Column("sponsor_name")
    private String sponsorNombre;

    @JsonAlias({"user_from_last_name", "userFromLastName", "user_from_last_name"})
    @Column("user_from_last_name")
    private String userFromLastName;

    @JsonAlias({"sponsor_last_name", "sponsorLastName", "sponsor_last_name"})
    @Column("sponsor_last_name")
    private String sponsorLastName;

    @JsonAlias({"sponsor_username", "sponsorUsername"})
    @Column("sponsor_username")
    private String sponsorUsername;

    @JsonAlias({"username_from", "usernameFrom"})
    @Column("username_from")
    private String usernameFrom;

    @JsonAlias({"username_to", "usernameTo"})
    @Column("username_to")
    private String usernameTo;

    @JsonAlias({"childId", "child_id", "childid"})
    @Column("child_id")
    private Integer childId;

    @JsonAlias({"name_membership", "nameMembership"})
    @Column("name_membership")
    private String nameMembership;

    @JsonAlias({"username_child", "usernameChild"})
    @Column("username_child")
    private String usernameChild;

}
