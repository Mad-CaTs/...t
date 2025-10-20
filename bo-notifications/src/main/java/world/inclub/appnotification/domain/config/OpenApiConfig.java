package world.inclub.appnotification.domain.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * andre on 12/02/2024
 */
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI springOpenAPI(Environment environment) {
        return new OpenAPI()
                .info(new Info().title(environment.getProperty("application.name"))
                                .description(environment.getProperty("application.description"))
                                .version(environment.getProperty("application.version"))
                                .license(new License().name("MIT").url("/license.html")));
    }
}
