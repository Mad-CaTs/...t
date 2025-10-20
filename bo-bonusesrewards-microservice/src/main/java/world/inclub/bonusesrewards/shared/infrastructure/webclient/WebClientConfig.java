package world.inclub.bonusesrewards.shared.infrastructure.webclient;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final WebClientProperties properties;

    @Bean
    public WebClient documentWebClient() {
        return getWebClient(properties.document());
    }

    @Bean
    public WebClient treeWebClient() {
        return getWebClient(properties.tree());
    }

    @Bean
    public WebClient dashboardWebClient() {
        return getWebClient(properties.dashboard());
    }

    @Bean
    public WebClient adminWebClient() {
        return getWebClient(properties.admin());
    }

    @Bean
    public WebClient ticketWebClient() {
        return getWebClient(properties.ticket());
    }

    @Bean
    public WebClient walletWebClient() {
        return getWebClient(properties.wallet());
    }

    private WebClient getWebClient(String baseUrl) {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofMinutes(1))
                .secure(t -> {
                    try {
                        t.sslContext(SslContextBuilder.forClient()
                                             .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                             .build());
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to build SSL context", e);
                    }
                });
        ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);
        return WebClient.builder()
                .clientConnector(connector)
                .baseUrl(baseUrl)
                .build();
    }

}
