package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.SeatTypeHandler;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class SeatTypeRouter {

    @Bean
    public RouterFunction<?> routeSeatType(SeatTypeHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/seattypes")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.GET("/seattypes")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/seattypes/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/seattypes/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/seattypes/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::delete);
    }
}