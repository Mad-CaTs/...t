package world.inclub.bonusesrewards.shared.payment.infrastructure.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public record StorageProperties (
        String vouchersFolder
) {}
