package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record UserTicketResponse(
        EventSummary event,
        Long paymentId,
        List<String> pdfUrls

) {
    @Builder
    public record EventSummary(
            Long id,
            String name,
            String type,
            LocalDate date,
            String flyerUrl,
            String location

    ) {}
}
