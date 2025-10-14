package world.inclub.ticket.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class EventZoneRequestDto {

    @NotNull
    private Integer eventId;

    @NotNull
    private Integer ticketTypeId;

    @NotEmpty
    @NotNull
    @Valid
    private List<ZoneDetail> zones;

    private List<Integer> zonesToDelete;

    @Data
    public static class ZoneDetail {

        private Integer eventZoneId;

        @NotNull
        private Integer seatTypeId;

        @NotBlank
        private String zoneName;

        @NotNull
        private BigDecimal price;

        @NotNull
        private BigDecimal priceSoles;

        @NotNull
        private Integer capacity;

        @NotNull
        private Integer seats;
    }

}