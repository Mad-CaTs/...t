package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.TicketTypeHandler;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class TicketTypeRouter {

    @Bean
    public RouterFunction<?> routeTicketType(TicketTypeHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/tickettypes").
                        and(accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.GET("/tickettypes").
                        and(accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/tickettypes/{id}").
                        and(accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/tickettypes/{id}").
                        and(accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/tickettypes/{id}").
                        and(accept(MediaType.APPLICATION_JSON)), handler::delete);
    }
}