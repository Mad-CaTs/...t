package world.inclub.bonusesrewards.shared.utils.filestorage.domain.model;

public record FileResource(
        String filename,
        byte[] content
) {
}
