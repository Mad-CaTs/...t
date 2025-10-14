package world.inclub.bonusesrewards.shared.utils.pagination.application;

import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;

public class PageDataBuilder {

    public static <T> PagedData<T> build(List<T> content, Pageable pageable, long total) {
        int pageSize = pageable.size();
        int currentPage = pageable.page();
        int totalPages = (int) Math.ceil((double) total / pageSize);

        String sortBy = pageable.sortBy();
        String sortDirection = pageable.direction();

        return new PagedData<>(
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

