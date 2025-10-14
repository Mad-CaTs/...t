package world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils;

import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;

public class PageableUtils {

    public static Pageable createPageable(PaginationRequest request, String defaultSortField) {
        int page = request.page() != null ? request.page() : 0;
        int size = request.size() != null ? request.size() : 20;
        String sortBy = request.sortBy() != null ? request.sortBy() : defaultSortField;
        boolean asc = request.asc() != null ? request.asc() : false;

        return new Pageable(page, size, sortBy, asc);
    }

}