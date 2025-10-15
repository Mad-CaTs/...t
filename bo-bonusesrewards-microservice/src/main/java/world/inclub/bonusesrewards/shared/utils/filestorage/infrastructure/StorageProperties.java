package world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public record StorageProperties (
        String quotationsFolder,
        String documentsFolder,
        String carsFolder,
        String vouchersFolder
) {}
