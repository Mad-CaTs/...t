package world.inclub.bonusesrewards.shared.exceptions;

public record ErrorDetails(
        Object error,
        String path,
        String timestamp,
        Integer status
) {
}
