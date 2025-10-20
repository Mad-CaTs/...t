package world.inclub.appnotification.transfer.infrastructure.kafka.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransferRejectionEnvelope {
    private boolean result;
    private Data data;
    private String timestamp;
    private int status;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        @JsonProperty("transferRequest")
        private TransferRequest transferRequest;
        @JsonProperty("rejection")
        private Rejection rejection;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TransferRequest {
        public String requester_last_name;
        public String dni_receptor_url;
        public Long sponsorId;
        public String user_to_apellido;
        public Integer user_to_tipo_documento;
        public String username_from;
        public String new_partner_last_name;
        public String dni_url;
        public LocalDateTime requestDate;
        public String user_to_nombre;
        public String user_from_last_name;
        public Long idUserFrom;
        public String sponsor_name;
        public String requester_name;
        public String user_from_nombre;
        public String user_to_genero;
        public String user_to_celular;
        public String user_from_email;
        public String user_to_numero_documento;
        public String user_to_correo_electronico;
        public String sponsor_last_name;
        public String username_to;
        public String new_partner_username;
        public String sponsor_nombre;
        public String sponsor_username;
        public Integer idTransferType;
        public Long idMembership;
        public String declaration_jurada_url;
        public Integer idTransferStatus;
        public Long idTransferRequest;
        public Long idUserTo;
        public String new_partner_name;
        public String user_to_direccion;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rejection {
        public LocalDateTime rejectedTransferAt;
        public Integer idTransferRejectionType;
        public Long idTransferRequest;
        public Long id;
        public String detailRejectionTransfer;
    }
}
