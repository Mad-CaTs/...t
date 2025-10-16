package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.EventVenueHandler;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class EventVenueRouter {

    @Bean
    public RouterFunction<?> routeEventVenue(EventVenueHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/eventvenues")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.GET("/eventvenues")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/eventvenues/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/eventvenues/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/eventvenues/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::delete);
    }
}
