package world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils;

import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;

import java.util.List;
import java.util.function.Function;

public final class PagedDataMapper {

    private PagedDataMapper() {}

    public static <S, R> PagedData<R> map(PagedData<S> source, Function<S, R> mapper) {
        List<R> mappedContent = source.content().stream()
                .map(mapper)
                .toList();

        return new PagedData<>(
                mappedContent,
                source.currentPage(),
                source.totalPages(),
                source.totalElements(),
                source.pageSize(),
                source.hasNext(),
                source.hasPrevious(),
                source.first(),
                source.last(),
                source.numberOfElements(),
                source.sortBy(),
                source.sortDirection()
        );
    }

}
