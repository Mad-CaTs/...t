package world.inclub.bonusesrewards.shared.infrastructure.webclient;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "web-client")
public record WebClientProperties(
        String document,
        String tree,
        String dashboard,
        String admin,
        String ticket,
        String wallet
) {}
