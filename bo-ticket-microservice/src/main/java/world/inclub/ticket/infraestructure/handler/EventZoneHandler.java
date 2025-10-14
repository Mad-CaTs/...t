package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventZoneRequestDto;
import world.inclub.ticket.api.dto.EventZoneResponseDto;
import world.inclub.ticket.application.service.EventZoneService;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

@Component
@RequiredArgsConstructor
public class EventZoneHandler {

    private final EventZoneService service;

    public Mono<ServerResponse> create(ServerRequest request) {
        return request.bodyToMono(EventZoneRequestDto.class)
                .flatMap(dto -> service.create(dto))
                .flatMap(result -> ServerResponse.created(request.uri())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al crear la zona: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(service.getAll(), EventZoneResponseDto.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return service.getEventZone(id)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener la zona: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return request.bodyToMono(EventZoneRequestDto.class)
                .flatMap(dto -> service.update(id, dto))
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al actualizar la zona: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return service.deleteById(id)
                .then(ServerResponse.noContent().build())
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al eliminar la zona: " + e.getMessage()));
    }

    public Mono<ServerResponse> getByEventId(ServerRequest request) {
        Integer eventId = Integer.valueOf(request.pathVariable("eventId"));
        return service.getByEventId(eventId)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener zonas por eventId: " + e.getMessage()));
    }
}