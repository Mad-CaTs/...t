package world.inclub.ticket.infraestructure.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.web.cors.CorsConfiguration;

import lombok.extern.slf4j.Slf4j;
import world.inclub.ticket.domain.repository.UsersRepository;
import world.inclub.ticket.infraestructure.config.security.JWTAuthenticationManager;
import world.inclub.ticket.infraestructure.config.security.JWTUtil;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@Slf4j
public class WebSecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, JWTUtil tokenProvider,
            @Qualifier("jwtAuthenticationManager") ReactiveAuthenticationManager jwtAuthManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(
                            List.of(
                                "http://localhost:4200",
                                "https://inclub.world",
                                "https://www.inclub.world",
                                "https://panel.inclub.world",
                                "https://www.panel.inclub.world",
                                "https://dev.inclub.world",
                                "https://www.dev.inclub.world",
                                "https://panel-dev.inclub.world",
                                "https://www.panel-dev.inclub.world",
                                "https://bo-admin-2.web.app"
                            )
                        );
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    config.setMaxAge(8000L);
                    return config;
                }))
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(
                                "/users/event-signup",
                                "/users/event-login",
                                "/**"
                        ).permitAll()
                        .anyExchange().authenticated())
                .authenticationManager(jwtAuthManager)
                .addFilterBefore(authenticationWebFilter(jwtAuthManager), SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }

    @Bean
    public AuthenticationWebFilter authenticationWebFilter(
            @Qualifier("jwtAuthenticationManager") ReactiveAuthenticationManager jwtAuthManager) {
        AuthenticationWebFilter filter = new AuthenticationWebFilter(jwtAuthManager);

        if (jwtAuthManager instanceof JWTAuthenticationManager jwtManager) {
            filter.setServerAuthenticationConverter(jwtManager.authenticationConverter());
        }

        return filter;
    }

    @Bean("jwtAuthenticationManager")
    public ReactiveAuthenticationManager jwtAuthenticationManager(JWTUtil jwtUtil, UsersRepository usersRepository) {
        return new JWTAuthenticationManager(jwtUtil, usersRepository);
    }

}