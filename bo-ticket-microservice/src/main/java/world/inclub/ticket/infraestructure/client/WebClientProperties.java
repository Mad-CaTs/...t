package world.inclub.ticket.infraestructure.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "web-client")
public record WebClientProperties(
        String admin,
        String wallet,
        String document
) {}
