package world.inclub.appnotification.transfer.infrastructure.kafka.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProducerTransferBody {
    @JsonAlias({ "id_transfer_request", "idTransferRequest" })
    private Long id_transfer_request;

    @JsonAlias({ "id_transfer_status", "idTransferStatus" })
    private Integer id_transfer_status;

    @JsonProperty("id_transfer_type")
    @JsonAlias({ "idTransferType" })
    private Integer id_transfer_type;

    @JsonProperty("id_membership")
    @JsonAlias({ "idMembership" })
    private Long id_membership;

    @JsonProperty("nameMembership")
    @JsonAlias({ "name_membership", "name_memberhip", "membershipName" })
    private String nameMembership;

    @JsonProperty("id_user_from")
    @JsonAlias({ "idUserFrom" })
    private Long id_user_from;

    @JsonProperty("id_user_to")
    @JsonAlias({ "idUserTo" })
    private Long id_user_to;

    @JsonProperty("sponsor_id")
    @JsonAlias({ "sponsorId" })
    private Long sponsor_id;

    @JsonProperty("id_detail_transfer")
    @JsonAlias({ "idDetailTransfer" })
    private Long id_detail_transfer;

    @JsonProperty("transferRequestId")
    private Long transferRequestId;

    @JsonProperty("toUser")
    private String toUser;

    @JsonProperty("fromUser")
    private String fromUser;

    @JsonProperty("dniUrl")
    private String dniUrl;

    @JsonProperty("declarationJuradaUrl")
    private String declarationJuradaUrl;

    @JsonProperty("dni_solicitante")
    @JsonAlias({ "dniSolicitante" })
    private String dni_solicitante;

    @JsonProperty("declaracion_jurada")
    @JsonAlias({ "declaracionJurada" })
    private String declaracion_jurada;

    @JsonProperty("dni_receptor")
    @JsonAlias({ "dniReceptor" })
    private String dni_receptor;

    @JsonProperty("recipientEmail")
    private String recipientEmail;

    @JsonProperty("to")
    private String to;

    @JsonProperty("user_to_nombre")
    @JsonAlias({ "user_to_nombres", "userToNombre", "userToNombres" })
    private String user_to_nombre;

    @JsonProperty("user_to_apellido")
    @JsonAlias({ "user_to_apellidos", "userToApellido", "userToApellidos" })
    private String user_to_apellido;

    @JsonProperty("user_to_numero_documento")
    @JsonAlias({ "nroDocument" })
    private String user_to_numero_documento;

    @JsonProperty("user_to_tipo_documento")
    @JsonAlias({ "userToTipoDocumento" })
    private Integer user_to_tipo_documento;

    @JsonProperty("user_to_genero")
    @JsonAlias({ "userToGenero" })
    private String user_to_genero;

    @JsonAlias({ "user_to_celular", "userToCelular", "toPhone", "celular" })
    private String user_to_celular;

    @JsonProperty("user_from_nombre")
    @JsonAlias({ "userFromNombre", "userFromName" })
    private String user_from_nombre;

    @JsonProperty("user_from_last_name")
    @JsonAlias({ "user_from_apellido", "userFromLastName" })
    private String user_from_last_name;

    @JsonProperty("user_from_correo_electronico")
    @JsonAlias({ "userFromCorreoElectronico", "user_from_email", "userFromEmail", "user_from_correo_electronico" })
    private String user_from_correo_electronico;

    @JsonProperty("username_from")
    @JsonAlias({ "usernameFrom", "username_from" })
    private String username_from;

    @JsonProperty("username_child")
    @JsonAlias({ "usernameChild", "username_child" })
    private String username_child;

    @JsonProperty("sponsor_username")
    @JsonAlias({ "sponsorUsername", "sponsor_username" })
    private String sponsor_username;

    @JsonProperty("sponsor_name")
    @JsonAlias({ "sponsorName", "sponsor_name" })
    private String sponsor_name;

    @JsonProperty("sponsor_last_name")
    @JsonAlias({ "sponsorLastName", "sponsor_last_name" })
    private String sponsor_last_name;

    @JsonProperty("username_to")
    @JsonAlias({ "usernameTo", "username_to" })
    private String username_to;

    @JsonProperty("childId")
    @JsonAlias({ "child_id" })
    private String childId;

    @JsonAlias({ "requestDate" })
    @JsonProperty("request_date")
    private LocalDateTime request_date;

    @JsonAlias({ "approvalDate" })
    @JsonProperty("approval_date")
    private LocalDateTime approval_date;

    @JsonAlias({ "completionDate" })
    @JsonProperty("completion_date")
    private LocalDateTime completion_date;

    @JsonProperty("user_to_correo_electronico")
    @JsonAlias({ "userToCorreoElectronico", "toEmail", "recipient" })
    private String user_to_correo_electronico;

    @JsonProperty("body")
    @JsonAlias({ "data", "payload" })
    private Map<String, Object> body;

    @JsonProperty("id_transfer_rejection_type")
    @JsonAlias({ "idTransferRejectionType" })
    private Integer id_transfer_rejection_type;

    public String getEffectiveEmail() {
        String fromCandidate = getFromFieldOrBody("user_from_correo_electronico", "userFromEmail", "user_from_email",
                "user_from_correo_electronico");
        if (!isNullOrBlank(fromCandidate)) {
            return fromCandidate;
        }

        String value = recipientEmail;
        if (isNullOrBlank(value))
            value = user_to_correo_electronico;
        if (isNullOrBlank(value))
            value = to;
        if (isNullOrBlank(value))
            value = extractFromBody("recipientEmail", "user_to_correo_electronico", "userToCorreoElectronico",
                    "toEmail", "recipient",
                    "to", "toUser");
        if (isNullOrBlank(value) && body != null) {
            Object tr = body.get("transferRequest");
            if (tr instanceof Map<?, ?> trm) {
                Object fromEmail = trm.get("user_from_correo_electronico");
                if (isNullOrBlank(fromEmail))
                    fromEmail = trm.get("user_from_email");
                if (isNullOrBlank(fromEmail))
                    fromEmail = trm.get("userFromEmail");
                Object toEmail = trm.get("user_to_correo_electronico");
                if (isNullOrBlank(toEmail))
                    toEmail = trm.get("recipientEmail");
                if (!isNullOrBlank(fromEmail))
                    value = fromEmail.toString();
                else if (!isNullOrBlank(toEmail))
                    value = toEmail.toString();
            }
        }
        return value;
    }

    private boolean isNullOrBlank(Object value) {
        return value == null || value.toString().isBlank();
    }

    private String getFromFieldOrBody(String fieldName, String... bodyKeys) {
        try {
            java.lang.reflect.Field f = this.getClass().getDeclaredField(fieldName);
            f.setAccessible(true);
            Object value = f.get(this);
            if (!isNullOrBlank(value))
                return value.toString();
        } catch (Exception ignored) {
        }
        if (body != null) {
            if (!isNullOrBlank(body.get(fieldName)))
                return body.get(fieldName).toString();
            for (String key : bodyKeys) {
                if (!isNullOrBlank(body.get(key)))
                    return body.get(key).toString();
            }
            Object trObj = body.get("transferRequest");
            if (trObj instanceof java.util.Map<?, ?> trm) {
                if (!isNullOrBlank(trm.get(fieldName)))
                    return trm.get(fieldName).toString();
                for (String key : bodyKeys) {
                    if (!isNullOrBlank(trm.get(key)))
                        return trm.get(key).toString();
                }
            }
        }
        return null;
    }

    public TransferNotificationMessage toTransferNotificationMessage() {
        String firstName = getFromFieldOrBody("user_to_nombre", "userToNombre", "user_to_name");
        String lastName = getFromFieldOrBody("user_to_apellido", "userToApellido", "user_to_last_name");

        if ((isNullOrBlank(firstName) || isNullOrBlank(lastName)) && body != null) {
            Object tr = body.get("transferRequest");
            if (tr instanceof Map<?, ?> trm) {
                if (isNullOrBlank(firstName))
                    firstName = stringOf(trm.get("new_partner_name"));
                if (isNullOrBlank(lastName))
                    lastName = stringOf(trm.get("new_partner_last_name"));
                if (isNullOrBlank(firstName))
                    firstName = stringOf(trm.get("user_to_nombre"));
                if (isNullOrBlank(lastName))
                    lastName = stringOf(trm.get("user_to_apellido"));
            }
        }

        String fromFirst = getFromFieldOrBody("user_from_nombre", "userFromNombre", "user_from_name");
        String fromLast = getFromFieldOrBody("user_from_last_name", "userFromLastName", "user_from_last_name");

        if (isNullOrBlank(fromLast) && body != null) {
            Object trObj = body.get("transferRequest");
            if (trObj instanceof java.util.Map<?, ?> trm) {
                Object v = trm.get("user_from_last_name");
                if (isNullOrBlank(v))
                    v = trm.get("user_from_apellido");
                if (isNullOrBlank(v))
                    v = trm.get("userFromLastName");
                if (!isNullOrBlank(v)) {
                    fromLast = v.toString();
                }
            }
        }

        try {
            org.slf4j.LoggerFactory.getLogger(ProducerTransferBody.class)
                    .info("[NAME-MAP] resolved -> user_to_nombre='{}' user_to_apellido='{}' user_from_nombre='{}' user_from_last_name='{}' (recipientEmail='{}')",
                            firstName, lastName, fromFirst, fromLast, recipientEmail);
        } catch (Throwable ignored) {
        }

        String sponsorFirst = getFromFieldOrBody("sponsor_name", "sponsorName");
        String sponsorLast = getFromFieldOrBody("sponsor_last_name", "sponsorLastName");

        String document = getFromFieldOrBody("user_to_numero_documento", "nroDocument", "document", "documento");
        String email = getEffectiveEmail();
        String usernameTo = getFromFieldOrBody("username_to", "usernameTo");
        String usernameFrom = getFromFieldOrBody("username_from", "usernameFrom");
        String sponsorUsername = getFromFieldOrBody("sponsor_username", "sponsorUsername");
        String userToCelular = getFromFieldOrBody("user_to_celular", "userToCelular", "toPhone", "celular");

        Long idTransferRequest = null;
        try {
            String idStr = getFromFieldOrBody("id_transfer_request", "transferRequestId");
            if (!isNullOrBlank(idStr))
                idTransferRequest = Long.valueOf(idStr);
        } catch (Exception ignored) {
        }
        if (idTransferRequest == null && body != null) {
            Object tr = body.get("transferRequestId");
            if (!isNullOrBlank(tr)) {
                try {
                    idTransferRequest = Long.valueOf(tr.toString());
                } catch (Exception ignored) {
                }
            }
            Object trObj = body.get("transferRequest");
            if (idTransferRequest == null && trObj instanceof Map<?, ?> trm) {
                Object idVal = trm.get("idTransferRequest");
                if (!isNullOrBlank(idVal)) {
                    try {
                        idTransferRequest = Long.valueOf(idVal.toString());
                    } catch (Exception ignored) {
                    }
                }
            }
        }

        Integer statusValue = null;
        try {
            String statusStr = getFromFieldOrBody("id_transfer_status");
            if (!isNullOrBlank(statusStr))
                statusValue = Integer.valueOf(statusStr);
        } catch (Exception ignored) {
        }

        Integer idStatus = this.id_transfer_status != null ? this.id_transfer_status : statusValue;
        if ((idStatus == null || idStatus == 0) && body != null) {
            Object trObj = body.get("transferRequest");
            if (trObj instanceof Map<?, ?> trm) {
                Object st = trm.get("idTransferStatus");
                if (!isNullOrBlank(st)) {
                    try {
                        idStatus = Integer.valueOf(st.toString());
                    } catch (Exception ignored) {
                    }
                }
            }
            Object st2 = body.get("status");
            if ((idStatus == null || idStatus == 0) && !isNullOrBlank(st2)) {
                String s = st2.toString().toUpperCase();
                if (s.contains("PEND"))
                    idStatus = 1;
                else if (s.contains("ACCEPT"))
                    idStatus = 2;
                else if (s.contains("REJECT") || s.contains("RECHAZ"))
                    idStatus = 3;
            }
        }

        if (body != null) {
            Object[] keys = new Object[] { body.get("status_transfer"), body.get("statusTransfer"),
                    body.get("transfer_status") };
            for (Object stAny : keys) {
                if (stAny == null)
                    continue;
                try {
                    int v = Integer.parseInt(stAny.toString());
                    if (v == 2) {
                        idStatus = 2;
                        break;
                    }
                    if (v == 3) {
                        idStatus = 3;
                        break;
                    }
                    if (v == 1) {
                        idStatus = 1;
                        break;
                    }
                } catch (Exception ignored) {
                    String s = stAny.toString().toUpperCase();
                    if (s.contains("RECHAZ") || s.contains("REJECT")) {
                        idStatus = 3;
                        break;
                    }
                    if (s.contains("ACEPT") || s.contains("ACCEPT")) {
                        idStatus = 2;
                        break;
                    }
                    if (s.contains("PEND")) {
                        idStatus = 1;
                        break;
                    }
                }
            }
        }

        String rejectionReason = null;
        LocalDateTime rejectedAt = null;
        Integer rejectionTypeId = null;
        String rejectionTypeName = null;
        if (body != null) {
            Object rej = body.get("rejection");
            if (rej instanceof Map<?, ?> rj) {
                Object detail = rj.get("detailRejectionTransfer");
                if (isNullOrBlank(detail))
                    detail = rj.get("detail_rejection_transfer");
                if (!isNullOrBlank(detail))
                    rejectionReason = detail.toString();
                Object at = rj.get("rejectedTransferAt");
                if (at instanceof java.util.List<?> arr && arr.size() >= 3) {
                    try {
                        int year = Integer.parseInt(arr.get(0).toString());
                        int month = Integer.parseInt(arr.get(1).toString());
                        int day = Integer.parseInt(arr.get(2).toString());
                        int hour = arr.size() > 3 ? Integer.parseInt(arr.get(3).toString()) : 0;
                        int minute = arr.size() > 4 ? Integer.parseInt(arr.get(4).toString()) : 0;
                        int second = arr.size() > 5 ? Integer.parseInt(arr.get(5).toString()) : 0;
                        rejectedAt = java.time.LocalDateTime.of(year, month, day, hour, minute, second);
                    } catch (Exception ignored) {
                    }
                }
                Object typeId = rj.get("idTransferRejectionType");
                if (!isNullOrBlank(typeId)) {
                    try {
                        rejectionTypeId = Integer.valueOf(typeId.toString());
                    } catch (Exception ignored) {
                    }
                }
                Object typeName = rj.get("rejectionTypeName");
                if (!isNullOrBlank(typeName)) {
                    rejectionTypeName = typeName.toString();
                }
            }
            if (isNullOrBlank(rejectionReason)) {
                Object drt = body.get("detail_rejection_transfer");
                if (!isNullOrBlank(drt))
                    rejectionReason = drt.toString();
            }
            if (rejectionTypeId == null) {
                Object flatType = body.get("idTransferRejectionType");
                if (!isNullOrBlank(flatType)) {
                    try {
                        rejectionTypeId = Integer.valueOf(flatType.toString());
                    } catch (Exception ignored) {
                    }
                }
                if (rejectionTypeId == null && this.id_transfer_rejection_type != null) {
                    rejectionTypeId = this.id_transfer_rejection_type;
                }
            }
        }

        Integer idTransferTypeVal = this.id_transfer_type;
        if (idTransferTypeVal == null && body != null) {
            Object flat = body.get("idTransferType");
            if (isNullOrBlank(flat))
                flat = body.get("id_transfer_type");
            if (!isNullOrBlank(flat)) {
                try {
                    idTransferTypeVal = Integer.valueOf(flat.toString());
                } catch (Exception ignored) {
                }
            }
            if (idTransferTypeVal == null) {
                Object trObj = body.get("transferRequest");
                if (trObj instanceof java.util.Map<?, ?> trm) {
                    Object nestedType = trm.get("idTransferType");
                    if (isNullOrBlank(nestedType))
                        nestedType = trm.get("id_transfer_type");
                    if (!isNullOrBlank(nestedType)) {
                        try {
                            idTransferTypeVal = Integer.valueOf(nestedType.toString());
                        } catch (Exception ignored) {
                        }
                    }
                }
            }
        }

        String fromEmail = getFromFieldOrBody("user_from_correo_electronico", "userFromEmail", "user_from_email",
                "user_from_correo_electronico");
        String nameMembership = getFromFieldOrBody("nameMembership", "membershipName");
        if (isNullOrBlank(nameMembership) && body != null) {
            Object trObj = body.get("transferRequest");
            if (trObj instanceof java.util.Map<?, ?> trm) {
                Object v = trm.get("nameMembership");
                if (!isNullOrBlank(v))
                    nameMembership = v.toString();
                if (isNullOrBlank(nameMembership)) {
                    v = trm.get("membershipName");
                    if (!isNullOrBlank(v))
                        nameMembership = v.toString();
                }
                if (isNullOrBlank(nameMembership)) {
                    v = trm.get("membresiaTraspasar");
                    if (!isNullOrBlank(v))
                        nameMembership = v.toString();
                }
            }
        }

        String usernameChildResolved = getFromFieldOrBody("username_child", "usernameChild");
        if (usernameChildResolved == null && body != null) {
            Object trObj = body.get("transferRequest");
            if (trObj instanceof java.util.Map<?, ?> trm) {
                Object v = trm.get("username_child");
                if (!isNullOrBlank(v))
                    usernameChildResolved = v.toString();
                if (isNullOrBlank(usernameChildResolved)) {
                    v = trm.get("usernameChild");
                    if (!isNullOrBlank(v))
                        usernameChildResolved = v.toString();
                }
            }
        }
        try {
            org.slf4j.LoggerFactory.getLogger(ProducerTransferBody.class).info(
                    "[USERNAME-RESOLVE] resolved username_child='{}' (top-field='{}')", usernameChildResolved,
                    this.username_child);
        } catch (Throwable ignored) {
        }

        return TransferNotificationMessage.builder()
                .id_transfer_request(idTransferRequest)
                .id_transfer_status(idStatus)
                .id_transfer_type(idTransferTypeVal)
                .id_membership(this.id_membership)
                .id_user_from(this.id_user_from)
                .id_user_to(this.id_user_to)
                .sponsor_id(this.sponsor_id)
                .id_detail_transfer(this.id_detail_transfer)
                .transferRequestId(this.transferRequestId)
                .toUser(this.toUser)
                .fromUser(this.fromUser)
                .dniUrl(this.dniUrl)
                .declarationJuradaUrl(this.declarationJuradaUrl)
                .dni_solicitante(this.dni_solicitante)
                .declaracion_jurada(this.declaracion_jurada)
                .dni_receptor(this.dni_receptor)
                .recipientEmail(this.recipientEmail)
                .to(this.to)
                .user_to_nombre(firstName)
                .user_to_apellido(lastName)
                .user_to_numero_documento(document)
                .user_to_tipo_documento(this.user_to_tipo_documento)
                .user_to_genero(this.user_to_genero)
                .user_to_celular(userToCelular)
                .user_from_nombre(fromFirst)
                .user_from_last_name(fromLast)
                .user_from_email(fromEmail)
                .username_from(usernameFrom)
                .username_child(usernameChildResolved)
                .sponsor_username(sponsorUsername)
                .sponsor_nombre(sponsorFirst)
                .sponsor_last_name(sponsorLast)
                .nameMembership(nameMembership)
                .username_to(usernameTo)
                .childId(this.childId)
                .request_date(this.request_date)
                .approval_date(this.approval_date)
                .completion_date(this.completion_date)
                .user_to_correo_electronico(email)
                .rejectionReason(rejectionReason)
                .rejected_at(rejectedAt)
                .rejectionTypeId(rejectionTypeId)
                .rejectionTypeName(rejectionTypeName)
                .build();
    }

    private String extractFromBody(String... keys) {
        if (body == null)
            return null;
        for (String k : keys) {
            if (k == null)
                continue;
            Object v = body.get(k);
            if (v == null) {
                v = body.get(k.toLowerCase());
            }
            if (!isNullOrBlank(v)) {
                return v.toString();
            }
        }
        return null;
    }

    private String stringOf(Object v) {
        return v == null ? null : v.toString();
    }
}