package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.EventHandler;

@Configuration
public class EventRouter {

    @Bean
    public RouterFunction<?> routeEvent(EventHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/events")
                        .and(RequestPredicates.accept(MediaType.MULTIPART_FORM_DATA)), handler::create)
                .andRoute(RequestPredicates.GET("/events")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/events/past")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPastEvents)
                .andRoute(RequestPredicates.GET("/events/past/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPastEventById)
                .andRoute(RequestPredicates.PUT("/events/past/{id}")
                        .and(RequestPredicates.accept(MediaType.MULTIPART_FORM_DATA)), handler::updatePastEvent)
                .andRoute(RequestPredicates.GET("/events/canceled")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getCanceledEvents)
                .andRoute(RequestPredicates.GET("/events/active")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getActiveEvents)
                .andRoute(RequestPredicates.GET("/events/ongoing")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getOngoingEvents)
                .andRoute(RequestPredicates.GET("/events/inactive")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getInactiveEvents)
                .andRoute(RequestPredicates.GET("/events/public")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPublicEvents)
                .andRoute(RequestPredicates.GET("/events/public/zones")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPublicEventsWithZones)
                .andRoute(RequestPredicates.GET("/events/public/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPublicEventById)
                .andRoute(RequestPredicates.GET("/events/public/zones/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getPublicEventWithZonesById)
                .andRoute(RequestPredicates.GET("/events/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/events/{id}")
                        .and(RequestPredicates.accept(MediaType.MULTIPART_FORM_DATA)), handler::update)
                .andRoute(RequestPredicates.DELETE("/events/{id}")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), handler::delete);
    }
}