package world.inclub.ticket.infraestructure.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import world.inclub.ticket.infraestructure.client.WebClientProperties;
import world.inclub.ticket.infraestructure.storage.StorageProperties;

@Configuration
@EnableConfigurationProperties({
        WebClientProperties.class,
        StorageProperties.class
})
public class PropertiesConfig {
}
