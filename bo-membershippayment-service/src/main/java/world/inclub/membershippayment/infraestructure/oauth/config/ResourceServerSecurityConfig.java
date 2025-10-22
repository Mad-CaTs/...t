package world.inclub.membershippayment.infraestructure.oauth.config;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class ResourceServerSecurityConfig {


    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    // Este bloque nuevo es seguro, no modifica ningún comportamiento existente, solo añade una nueva configuración disponible.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://dev.inclub.world", "http://localhost:4200", "https://inclub.world","https://www.inclub.world", "https://panel-dev.inclub.world", "https://panel.inclub.world"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .requestCache(ServerHttpSecurity.RequestCacheSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/api/v1/**").permitAll()
                        .pathMatchers(SecurityConstants.AUTH_WHITELIST).permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt ->
                                jwt.jwtAuthenticationConverter(converter())
                        )
                );

              /* http
                 .csrf(ServerHttpSecurity.CsrfSpec::disable)
                 .cors(ServerHttpSecurity.CorsSpec::disable)
                 .authorizeExchange(exchanges -> exchanges
                    .anyExchange().permitAll()) // Permitir todas las solicitudes sin autenticación
                 ;*/
                
        http.securityContextRepository(NoOpServerSecurityContextRepository.getInstance());
        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return ReactiveJwtDecoders.fromIssuerLocation(issuerUri);
    }

    public Converter<Jwt, Mono<AbstractAuthenticationToken>> converter() {
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            var roles = jwt.getClaimAsStringList("roles");
            var scopes = jwt.getClaimAsStringList("scope");

            List<String> authorities = new ArrayList<>();

            // Corrección para evitar NullPointerException si roles o scopes son nulos
            if (roles != null) {
                authorities.addAll(roles);
            }
            if (scopes != null) {
                for (String scope : scopes) {
                    authorities.add("SCOPE_" + scope);
                }
            }

            return Flux.fromIterable(authorities)
                    .map(SimpleGrantedAuthority::new);
        });
        return converter;
    }

}