package world.inclub.bonusesrewards.shared.utils.pagination.application;

import lombok.Builder;

import java.util.List;

@Builder(toBuilder = true)
public record PagedData<T>(
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
