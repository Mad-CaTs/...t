package world.inclub.ticket.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import world.inclub.ticket.infraestructure.controller.dto.PaginationRequest;

public class PageableUtils {

    public static Pageable createPageable(PaginationRequest request, String defaultSortField) {
        int page = request.page() != null ? request.page() : 0;
        int size = request.size() != null ? request.size() : 20;
        String sortBy = request.sortBy() != null ? request.sortBy() : defaultSortField;
        boolean asc = request.asc() != null ? request.asc() : true;

        Sort sort = asc ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }

}