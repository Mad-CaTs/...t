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
public class PaginatedEventTicketPackageResponse {
    private List<EventTicketPackageResponse> events;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
