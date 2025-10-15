package world.inclub.bonusesrewards.shared.infrastructure.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure.StorageProperties;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.WebClientProperties;

@Configuration
@EnableConfigurationProperties({
        WebClientProperties.class,
        StorageProperties.class
})
public class PropertiesConfig {
}
