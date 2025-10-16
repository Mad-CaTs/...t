package world.inclub.ticket.infraestructure.controller.dto;

public record PaginationRequest(
        Integer page,
        Integer size,
        String sortBy,
        Boolean asc
) {
}
