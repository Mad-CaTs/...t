package world.inclub.bonusesrewards.shared.utils.pagination.domain;

public record Pageable(
        Integer page,
        Integer size,
        String sortBy,
        Boolean asc
) {
    public Integer offset() {
        return page * size;
    }

    public Integer limit() {
        return size;
    }

    public String direction() {
        return asc ? "ASC" : "DESC";
    }
}
