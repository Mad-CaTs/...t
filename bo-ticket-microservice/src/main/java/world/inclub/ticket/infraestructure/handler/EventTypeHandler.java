package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventTypeRequestDto;
import world.inclub.ticket.api.dto.EventTypeResponseDto;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import static org.springframework.web.reactive.function.server.ServerResponse.created;
import static org.springframework.web.reactive.function.server.ServerResponse.badRequest;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;
import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
import static org.springframework.web.reactive.function.server.ServerResponse.noContent;
import java.util.UUID;

/**
 * Handler para gestionar las peticiones relacionadas a EventType.
 * Aquí se orquesta la interacción entre la capa web y los casos de uso.
 */
@Component
@RequiredArgsConstructor
public class EventTypeHandler {
    private final CreateEventTypeUseCase createUseCase;
    private final GetAllEventTypesUseCase getAllUseCase;
    private final GetEventTypeByIdUseCase getByIdUseCase;
    private final UpdateEventTypeUseCase updateUseCase;
    private final DeleteEventTypeUseCase deleteUseCase;

    /**
     * Maneja la creación de un nuevo tipo de evento.
     */
    public Mono<ServerResponse> create(ServerRequest request) {
        Mono<EventTypeRequestDto> dtoMono = request.bodyToMono(EventTypeRequestDto.class);

        // Ejemplo: obtener UUID de usuario desde un header o token (simplificado aquí)
        UUID userId = UUID.randomUUID(); // Reemplazar por lógica real
        //UUID userId = UUID.fromString("11111111-1111-1111-1111-111111111111"); // Fijo temporalmente

        return dtoMono
                .flatMap(dto -> createUseCase.create(dto, userId))
                .flatMap(result -> created(request.uri()).contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(e -> badRequest().bodyValue("Error creating EventType: " + e.getMessage()));
    }

    /**
     * Maneja la obtención de todos los tipos de eventos.
     */
    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAllUseCase.getAll(), EventTypeResponseDto.class);
    }

    /**
     * Maneja la obtención de un tipo de evento por ID.
     */
    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));

        return getByIdUseCase.getById(id)
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error al buscar EventType: " + e.getMessage()));
    }

    /**
     * Maneja la actualización de un tipo de evento.
     */
    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        Mono<EventTypeRequestDto> dtoMono = request.bodyToMono(EventTypeRequestDto.class);

        UUID userId = UUID.randomUUID(); // Reemplazar por lógica real

        return dtoMono
                .flatMap(dto -> updateUseCase.update(id, dto, userId))
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error updating EventType: " + e.getMessage()));
    }

    /**
     * Maneja la eliminación de un tipo de evento por ID.
     */
    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));

        return deleteUseCase.deleteById(id)
                .then(noContent().build())
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error eliminando EventType: " + e.getMessage()));
    }
}
