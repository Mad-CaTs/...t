package world.inclub.appnotification.transfer.infrastructure.web;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import world.inclub.appnotification.transfer.infrastructure.email.adapters.TransferEmailBuilderAdapter;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@RestController
@RequestMapping("/transfer")
@RequiredArgsConstructor
public class TransferEmailPreviewController {

    private final TransferEmailBuilderAdapter builderAdapter;

    private static final ObjectMapper PREVIEW_MAPPER = new ObjectMapper();

    @PostMapping(value = "/preview", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> preview(@RequestBody Map<String, Object> payload) {
        Integer idTransferType = getIntFlex(payload, "id_transfer_type", "idTransferType");
        Long idTransferRequest = getLongFlex(payload, "id_transfer_request", "idTransferRequest");
        String userToNombre = getStringFlex(payload, "user_to_nombre", "userToNombre", "user_to_name", "userToName");
        String userToApellido = getStringFlex(payload, "user_to_apellido", "userToApellido", "user_to_last_name",
                "userToLastName");
        String userToDocumento = getStringFlex(payload, "user_to_numero_documento", "userToNumeroDocumento",
                "user_to_numero_documento");
        String usernameChild = getStringFlex(payload, "username_child", "usernameChild");
        String nameMembership = getStringFlex(payload, "nameMembership", "name_membership", "name_memberhip",
                "membershipName", "membresiaTraspasar");
        String childId = getStringFlex(payload, "childId", "child_id", "childid");
        String userFromNombre = getStringFlex(payload, "user_from_nombre", "userFromNombre", "user_from_name");
        String userFromLast = getStringFlex(payload, "user_from_last_name", "userFromLastName", "user_from_apellido");

        TransferNotificationMessage message = TransferNotificationMessage.builder()
                .id_transfer_type(idTransferType)
                .id_transfer_request(idTransferRequest)
                .user_to_nombre(userToNombre)
                .user_to_apellido(userToApellido)
                .user_to_numero_documento(userToDocumento)
                .username_to(usernameChild)
                .childId(childId)
                .username_child(usernameChild)
                .nameMembership(nameMembership)
                .user_from_nombre(userFromNombre)
                .user_from_last_name(userFromLast)
                .build();

        String html = builderAdapter.buildHtml(message);
        String subject = builderAdapter.getSubject();

        Object debugFlag = payload.get("debug");
        if ((debugFlag instanceof Boolean && (Boolean) debugFlag)
                || (debugFlag instanceof String && "true".equalsIgnoreCase((String) debugFlag))) {
            Map<String, Object> model = builderAdapter.getModelForMessage(message);
            return ResponseEntity.ok(Map.of("subject", subject == null ? "" : subject, "html", html == null ? "" : html,
                    "model", model));
        }

        return ResponseEntity.ok(Map.of("subject", subject == null ? "" : subject, "html", html == null ? "" : html));
    }

    private Integer getIntFlex(Map<String, Object> payload, String... keys) {
        for (String k : keys) {
            Object v = payload.get(k);
            if (v instanceof Number)
                return ((Number) v).intValue();
            if (v instanceof String) {
                try {
                    return Integer.valueOf(((String) v).trim());
                } catch (Exception e) {
                    /* ignore */ }
            }
        }
        return null;
    }

    private Long getLongFlex(Map<String, Object> payload, String... keys) {
        for (String k : keys) {
            Object v = payload.get(k);
            if (v instanceof Number)
                return ((Number) v).longValue();
            if (v instanceof String) {
                try {
                    return Long.valueOf(((String) v).trim());
                } catch (Exception e) {
                    /* ignore */ }
            }
        }
        return null;
    }

    private String getStringFlex(Map<String, Object> payload, String... keys) {
        for (String k : keys) {
            Object v = payload.get(k);
            if (v instanceof String) {
                String s = ((String) v).trim();
                if (!s.isEmpty())
                    return s;
            } else if (v != null) {
                return String.valueOf(v);
            }
        }
        Object nested = payload.get("data");
        if (nested == null)
            nested = payload.get("body");

        Map<String, Object> nestedMap = null;
        if (nested instanceof Map<?, ?> nestedMapObj) {
            @SuppressWarnings("unchecked")
            Map<String, Object> tmp = (Map<String, Object>) nestedMapObj;
            nestedMap = tmp;
        } else if (nested instanceof String nestedStr && !((String) nestedStr).isBlank()) {
            try {
                nestedMap = PREVIEW_MAPPER.readValue((String) nestedStr, new TypeReference<Map<String, Object>>() {
                });
            } catch (Exception ignored) {
            }
        }

        if (nestedMap != null) {
            for (String k : keys) {
                Object v = nestedMap.get(k);
                if (v instanceof String) {
                    String s = ((String) v).trim();
                    if (!s.isEmpty())
                        return s;
                } else if (v != null) {
                    return String.valueOf(v);
                }
            }
            Object tr = nestedMap.get("transferRequest");
            Map<String, Object> trMap = null;
            if (tr instanceof Map<?, ?> trObj) {
                @SuppressWarnings("unchecked")
                Map<String, Object> tmp = (Map<String, Object>) trObj;
                trMap = tmp;
            } else if (tr instanceof String trStr && !((String) trStr).isBlank()) {
                try {
                    trMap = PREVIEW_MAPPER.readValue((String) trStr, new TypeReference<Map<String, Object>>() {
                    });
                } catch (Exception ignored) {
                }
            }
            if (trMap != null) {
                for (String k : keys) {
                    Object v = trMap.get(k);
                    if (v instanceof String) {
                        String s = ((String) v).trim();
                        if (!s.isEmpty())
                            return s;
                    } else if (v != null) {
                        return String.valueOf(v);
                    }
                }
            }
        }
        return null;
    }
}
