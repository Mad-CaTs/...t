package world.inclub.membershippayment.crosscutting.beansConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableWebFlux
public class WebFluxConfiguration implements WebFluxConfigurer {
    @Override
    public void configureHttpMessageCodecs(ServerCodecConfigurer configurer) {
        int MAX_MEMORY_SIZE = 50 * 1024 * 1024;
        configurer.defaultCodecs().maxInMemorySize(MAX_MEMORY_SIZE);
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient adminPanelWebClient(@Value("${api.adminpanel.url}") String adminPanelApiUrl, WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl(adminPanelApiUrl).build();
    }

    @Bean
    public WebClient collaboratorWebClient(@Value("${api.collaborator.url}") String collaboratorApiUrl, WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl(collaboratorApiUrl).build();
    }
}
