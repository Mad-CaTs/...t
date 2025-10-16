package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.TicketTypeRequestDTO;
import world.inclub.ticket.api.dto.TicketTypeResponseDTO;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.UUID;

import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
@RequiredArgsConstructor
public class TicketTypeHandler {
    private final CreateTicketTypeUseCase createUseCase;
    private final GetAllTicketTypeUseCase getAllUseCase;
    private final GetTicketTypeByIdUseCase getByIdUseCase;
    private final UpdateTicketTypeUseCase updateUseCase;
    private final DeleteTicketTypeUseCase deleteUseCase;

    public Mono<ServerResponse> create(ServerRequest request){
        Mono<TicketTypeRequestDTO> dtoMono = request.bodyToMono(TicketTypeRequestDTO.class);

        UUID userId = UUID.randomUUID();

        return dtoMono
                .flatMap(dto -> createUseCase.create(dto, userId))
                .flatMap(result -> created(request.uri()).contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(e -> badRequest().bodyValue("Error creating TicketType: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request){
        return ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAllUseCase.getAll(), TicketTypeResponseDTO.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request){
        Integer id = Integer.valueOf(request.pathVariable("id"));

        return getByIdUseCase.getById(id)
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error al buscar TicketType: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request){
        Integer id = Integer.valueOf(request.pathVariable("id"));
        Mono<TicketTypeRequestDTO> dtoMono = request.bodyToMono(TicketTypeRequestDTO.class);

        UUID userId = UUID.randomUUID();

        return dtoMono
                .flatMap(dto -> updateUseCase.updateById(id, dto, userId))
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error updating TicketType: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request){
        Integer id = Integer.valueOf(request.pathVariable("id"));

        return deleteUseCase.deleteById(id)
                .then(noContent().build())
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error deleting TicketType: " + e.getMessage()));
    }
}