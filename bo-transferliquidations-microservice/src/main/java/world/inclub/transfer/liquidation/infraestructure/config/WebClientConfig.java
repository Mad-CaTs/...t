package world.inclub.transfer.liquidation.infraestructure.config;

import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import reactor.netty.http.client.HttpClient;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class WebClientConfig {

        private SslContext insecureSslContext() {
                try {
                        return SslContextBuilder.forClient()
                                        .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                        .build();
                } catch (javax.net.ssl.SSLException e) {
                        throw new IllegalStateException("Failed to initialize insecure SSL context", e);
                }
        }

        @Bean
        public WebClient accountWebClient(Environment env) {
                String baseUrl = env.getProperty("api.account.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.account.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));
                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);
                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .build();
        }

        @Bean
        public WebClient notificationWebClient(Environment env) {
                String baseUrl = env.getProperty("api.notification.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.notification.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));
                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);
                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .build();
        }

        @Bean
        public WebClient adminPanelWebClient(Environment env) {
                String baseUrl = env.getProperty("api.adminpanel.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.adminpanel.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));
                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);
                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .filter(logRequest("AdminPanelWebClient"))
                                .build();
        }

        @Bean
        public WebClient membershipWebClient(Environment env) {
                String baseUrl = env.getProperty("api.membership.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.membership.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));
                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);
                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .build();
        }

        @Bean
        public WebClient localAccountWebClient(Environment env) {
                        String baseUrl = env.getProperty("api.localAccount.url");
                        if (baseUrl == null || baseUrl.isBlank()) {
                                throw new IllegalStateException("Missing required property 'api.localAccount.url' in application.yml");
                        }
                        HttpClient httpClient = HttpClient.create().wiretap(true);
                        ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);

                        return WebClient.builder()
                                        .clientConnector(connector)
                                        .baseUrl(baseUrl)
                                        .filter(logRequest("AccountWebClient"))
                                        .build();
        }

        // @Bean
        // public WebClient documentWebClient() {

        // return WebClient.builder()
        // .baseUrl("https://documentapi-dev.inclub.site/api/v1/s3") // Cambia la URL
        // base según
        // // sea necesario
        // .build();
        // }

        @Bean
        public WebClient documentWebClient(Environment env) {
                String baseUrl = env.getProperty("api.document.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.document.url' in application.yml");
                }

                return WebClient.builder()
                                .baseUrl(baseUrl)
                                .filter(logRequest())
                                .build();
        }

        private ExchangeFilterFunction logRequest() {
                Logger logger = LoggerFactory.getLogger("DocumentWebClient");
                return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
                        logger.info("[DocumentWebClient] Request: {} {}", clientRequest.method(), clientRequest.url());
                        return Mono.just(clientRequest);
                });
        }

            private ExchangeFilterFunction logRequest(String name) {
                    Logger logger = LoggerFactory.getLogger(name);
                    return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
                            logger.info("[{}] Request: {} {}", name, clientRequest.method(), clientRequest.url());
                            clientRequest.headers().forEach((k, v) -> logger.debug("[{}] Request header: {}={}", name, k, v));
                            return Mono.just(clientRequest);
                    });
            }

        @Bean
        public WebClient transferWebClient(Environment env) {
                String baseUrl = env.getProperty("api.transfer.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.transfer.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));

                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);

                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .build();
        }

        @Bean
        public WebClient jobStatusWebClient(Environment env) {
                String baseUrl = env.getProperty("api.jobstatus.url");
                if (baseUrl == null || baseUrl.isBlank()) {
                        throw new IllegalStateException("Missing required property 'api.jobstatus.url' in application.yml");
                }
                SslContext sslContext = insecureSslContext();
                HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));
                ClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);

                return WebClient.builder()
                                .clientConnector(connector)
                                .baseUrl(baseUrl)
                                .filter(logRequest("JobStatusWebClient"))
                                .build();
        }
}
