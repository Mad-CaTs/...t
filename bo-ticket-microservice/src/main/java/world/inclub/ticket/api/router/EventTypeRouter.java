package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.EventTypeHandler;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
/**
 * Router para definir las rutas HTTP relacionadas a EventType.
 */
@Configuration
public class EventTypeRouter {

    @Bean
    public RouterFunction<?> routeEventType(EventTypeHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/eventtypes").and(accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.GET("/eventtypes").and(accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/eventtypes/{id}").and(accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/eventtypes/{id}").and(accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/eventtypes/{id}").and(accept(MediaType.APPLICATION_JSON)), handler::delete);
    }
}
