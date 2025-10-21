/*package world.inclub.wallet.infraestructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Permitir credenciales
        config.addAllowedOrigin("http://localhost:4200"); // Permitir el origen del frontend
        config.addAllowedOrigin("http://gateway-dev.inclub:8090");
        config.addAllowedOrigin("https://bo-admin-2.web.app");
        config.addAllowedOrigin("https://gateway-dev.inclub.world");
        config.addAllowedOrigin("https://membershippay-dev.inclub.world");
        config.addAllowedHeader("*"); // Permitir todas las cabeceras
        config.addAllowedMethod("*"); // Permitir todos los métodos
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }

}

 */
