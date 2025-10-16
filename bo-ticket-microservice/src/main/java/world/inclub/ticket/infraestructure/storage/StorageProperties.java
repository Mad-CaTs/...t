package world.inclub.ticket.infraestructure.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public record StorageProperties (
        String vouchersFolder,
        String ticketsFolder
) {}
