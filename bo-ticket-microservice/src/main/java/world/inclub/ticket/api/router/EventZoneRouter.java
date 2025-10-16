package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.EventZoneHandler;

@Configuration
public class EventZoneRouter {

    @Bean
    public RouterFunction<?> routeEventZone(EventZoneHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/event-zones")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.GET("/event-zones")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/event-zones/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/event-zones/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/event-zones/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::delete)
                .andRoute(RequestPredicates.GET("/event-zones/event/{eventId}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getByEventId);
    }
}