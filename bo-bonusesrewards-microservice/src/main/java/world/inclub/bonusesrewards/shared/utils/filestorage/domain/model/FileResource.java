package world.inclub.bonusesrewards.shared.utils.filestorage.domain.model;

import lombok.Builder;

@Builder
public record FileResource(
        String filename,
        byte[] content,
        Long sizeBytes,
        String mimeType
) {
    public static FileResource empty() {
        return FileResource.builder().build();
    }
}
