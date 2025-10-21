package world.inclub.wallet.infraestructure.oauth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.exception.security.CustomOAuth2AccessDeniedHandler;
import world.inclub.wallet.infraestructure.exception.security.CustomOAuth2AuthenticationEntryPoint;

import java.util.ArrayList;
import java.util.List;

@Configuration(proxyBeanMethods = false)
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@RequiredArgsConstructor
public class ResourceServerSecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    final CustomOAuth2AuthenticationEntryPoint customOAuth2AuthenticationEntryPoint;
    final CustomOAuth2AccessDeniedHandler customOAuth2AccessDeniedHandler;

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .requestCache(ServerHttpSecurity.RequestCacheSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(SecurityConstants.AUTH_WHITELIST).permitAll()
                        .pathMatchers("/api/v1/**").permitAll()
                        .pathMatchers("/version/**").permitAll()
                        .pathMatchers("/v1/auditlog/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt ->
                                jwt.jwtAuthenticationConverter(converter())
                        )
                )
                .exceptionHandling(
                        exceptionHandlingSpec -> exceptionHandlingSpec
                                .authenticationEntryPoint(customOAuth2AuthenticationEntryPoint)
                                .accessDeniedHandler(customOAuth2AccessDeniedHandler)
                );
        // http
        // .csrf(ServerHttpSecurity.CsrfSpec::disable)
        // .cors(ServerHttpSecurity.CorsSpec::disable)
        // .authorizeExchange(exchanges -> exchanges
        //     .anyExchange().permitAll() // Permitir todas las solicitudes sin autenticación
        // )
        // .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
        //     .authenticationEntryPoint(customOAuth2AuthenticationEntryPoint)
        //     .accessDeniedHandler(customOAuth2AccessDeniedHandler)
        // );

        http.securityContextRepository(NoOpServerSecurityContextRepository.getInstance());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("https://panel-dev.inclub.world/");
        configuration.addAllowedOrigin("https://panel.inclub.world/");
        configuration.addAllowedOrigin("https://dev.inclub.world/");
        configuration.addAllowedOrigin("https://www.dev.inclub.world/");
        configuration.addAllowedOrigin("https://inclub.world/");
        configuration.addAllowedOrigin("https://www.inclub.world/");
        configuration.addAllowedOrigin("http://localhost:4200");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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

            List<String> authorities = new ArrayList<>(roles);

            for (String scope : scopes) {
                authorities.add("SCOPE_" + scope);
            }

            return Flux.fromIterable(authorities)
                    .map(SimpleGrantedAuthority::new);
        });
        return converter;
    }

}
