package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventVenueRequestDto;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.UUID;

import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
@RequiredArgsConstructor
public class EventVenueHandler {
    private final CreateEventVenueUseCase createUseCase;
    private final GetAllEventVenueUseCase getAllUseCase;
    private final GetEventVenueUseCase getByIdUseCase;
    private final UpdateEventVenueUseCase updateUseCase;
    private final DeleteEventVenueUseCase deleteUseCase;

    public Mono<ServerResponse> create(ServerRequest request) {
        Mono<EventVenueRequestDto> dtoMono = request.bodyToMono(EventVenueRequestDto.class);
        UUID userId = UUID.randomUUID();
        return dtoMono
                .flatMap(dto -> createUseCase.create(dto, userId))
                .flatMap(result -> created(request.uri()).contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(e -> badRequest().bodyValue("Error creatig EventVenue " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAllUseCase.getAll(), EventVenueRequestDto.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getByIdUseCase.getById(id)
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error search EventVenue: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        Mono<EventVenueRequestDto> dtoMono = request.bodyToMono(EventVenueRequestDto.class);
        UUID userId = UUID.randomUUID();
        return dtoMono
                .flatMap(dto -> updateUseCase.update(id, dto, userId))
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error search EventVenue: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return deleteUseCase.deleteById(id)
                .then(noContent().build())
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error deleting EventVenue: " + e.getMessage()));
    }
}
