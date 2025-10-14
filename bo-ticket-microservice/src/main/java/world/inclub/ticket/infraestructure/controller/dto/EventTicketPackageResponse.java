package world.inclub.ticket.infraestructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTicketPackageResponse {
    private Long eventId;
    private String eventName;
    private Long countPackages;
    private List<TicketPackageResponse> packages;

    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}