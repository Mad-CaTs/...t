package world.inclub.ticket.api.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import world.inclub.ticket.infraestructure.handler.UsersHandler;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class UsersRouter {

    @Bean
    public RouterFunction<?> routeUsers(UsersHandler handler) {
        return RouterFunctions
                .route(RequestPredicates.POST("/users/event-signup")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::create)
                .andRoute(RequestPredicates.POST("/users/register")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::createUser)
                .andRoute(RequestPredicates.GET("/document-types")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getAllDocumentTypes)
                .andRoute(RequestPredicates.GET("/users")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getAll)
                .andRoute(RequestPredicates.GET("/users/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getById)
                .andRoute(RequestPredicates.PUT("/users/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::update)
                .andRoute(RequestPredicates.DELETE("/users/delete/{id}")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::delete)
                .andRoute(RequestPredicates.POST("/users/event-login")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::login)
                .andRoute(RequestPredicates.GET("/users/{id}/info")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::getUserInfo)
                .andRoute(RequestPredicates.PATCH("/users/{id}/profile")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::updateProfile)
                .andRoute(RequestPredicates.PUT("/users/{id}/password")
                        .and(accept(MediaType.APPLICATION_JSON)), handler::changePassword);
    }
}