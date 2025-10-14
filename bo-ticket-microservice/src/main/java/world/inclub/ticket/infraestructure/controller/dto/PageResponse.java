package world.inclub.ticket.infraestructure.controller.dto;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        Integer currentPage,
        Integer totalPages,
        Long totalElements,
        Integer pageSize,
        Boolean hasNext,
        Boolean hasPrevious,
        Boolean first,
        Boolean last,
        Integer numberOfElements,
        String sortBy,
        String sortDirection
) {}
