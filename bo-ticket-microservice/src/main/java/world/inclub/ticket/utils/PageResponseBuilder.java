package world.inclub.ticket.utils;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;

import java.util.List;

public class PageResponseBuilder {

    public static <T> PageResponse<T> build(List<T> content, Pageable pageable, long total) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int totalPages = (int) Math.ceil((double) total / pageSize);

        String sortBy = null;
        String sortDirection = null;

        if (pageable.getSort().isSorted()) {
            Sort.Order order = pageable.getSort().iterator().next();
            sortBy = order.getProperty();
            sortDirection = order.getDirection().name();
        }

        return new PageResponse<>(
                content,
                currentPage,
                totalPages,
                total,
                pageSize,
                currentPage < totalPages - 1,
                currentPage > 0,
                currentPage == 0,
                currentPage == totalPages - 1,
                content.size(),
                sortBy,
                sortDirection
        );
    }
}

