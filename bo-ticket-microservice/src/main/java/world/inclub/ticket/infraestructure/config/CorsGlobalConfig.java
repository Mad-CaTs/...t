package world.inclub.ticket.infraestructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración global de CORS para el microservicio.
 */
@Configuration
public class CorsGlobalConfig {
    /**
     * Define el filtro de CORS que será aplicado globalmente a todas las rutas del backend.
     *
     * @return CorsWebFilter configurado con las reglas necesarias
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        // Crear configuración CORS
        CorsConfiguration config = new CorsConfiguration();

        // Habilitar el envío de cookies o cabeceras de autenticación (como Authorization)
        config.setAllowCredentials(false);

        // Orígenes permitidos. Puedes agregar más o cambiar "*" en desarrollo.
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        // Métodos HTTP permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Cabeceras que se aceptan desde el frontend
        config.setAllowedHeaders(Arrays.asList("*"));

        // Registrar la configuración para que se aplique a todas las rutas del backend
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
