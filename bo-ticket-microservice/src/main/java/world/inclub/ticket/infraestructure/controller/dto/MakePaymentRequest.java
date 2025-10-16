package world.inclub.ticket.infraestructure.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class MakePaymentRequest {

        @NotNull
        @Positive
        private Long userId;

        @NotNull
        @Positive
        private Long eventId;

        @NotNull
        private PaymentMethod method;

        @NotNull
        private Integer paymentSubTypeId;

        @NotNull
        private CurrencyType currencyType;

        private List<PackageSelection> packages;

        private List<Attendee> attendeePackages;

        private List<ZoneSelection> zones;

        private List<Attendee> attendees;

        private Voucher voucher;

        @NotNull
        @Positive
        private BigDecimal totalAmount;

        @Data
        @NoArgsConstructor
        public static class ZoneSelection {
                @NotNull
                @Positive
                private Long eventZoneId;

                @NotNull
                @Positive
                private Integer quantity;
        }

        @Data
        @NoArgsConstructor
        public static class Attendee {
                @NotNull
                @Positive
                private Long eventZoneId;

                @NotNull
                private Long documentTypeId;

                @NotBlank
                private String documentNumber;

                @NotBlank
                private String email;

                @NotBlank
                private String name;

                @NotBlank
                private String lastName;
        }

        @Data
        @NoArgsConstructor
        public static class Voucher {
                @NotBlank
                private String operationNumber;

                @NotBlank
                private String note;

                @NotNull
                private FilePart image;
        }

        @Data
        @NoArgsConstructor
        public static class PackageSelection {

                @Positive
                private Long packageId;

                @Positive
                private Integer quantity;
        }

}
