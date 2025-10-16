package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.SeatTypeRequestDto;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.UUID;

import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
@RequiredArgsConstructor
public class SeatTypeHandler {
    private final CreateSeatTypeUseCase createUseCase;
    private final GetAllSeatTypeUseCase getAllUseCase;
    private final GetSeatTypeByIdUseCase getByIdUseCase;
    private final UpdateSeatTypeUseCase updateUseCase;
    private final DeleteSeatTypeUseCase deleteUseCase;

    public Mono<ServerResponse> create(ServerRequest request) {
        Mono<SeatTypeRequestDto> dtoMono = request.bodyToMono(SeatTypeRequestDto.class);
        UUID userId = UUID.randomUUID();
        return dtoMono
                .flatMap(dto -> createUseCase.create(dto, userId))
                .flatMap(result -> created(request.uri()).contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(e -> badRequest().bodyValue("Error creating SeatType: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAllUseCase.getAll(), SeatTypeResponseDTO.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getByIdUseCase.getById(id)
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error searching SeatType: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        Mono<SeatTypeRequestDto> dtoMono = request.bodyToMono(SeatTypeRequestDto.class);
        UUID userId = UUID.randomUUID();
        return dtoMono
                .flatMap(dto -> updateUseCase.updateById(id, dto, userId))
                .flatMap(result -> ok().contentType(MediaType.APPLICATION_JSON).bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error updating SeatType: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return deleteUseCase.delete(id)
                .then(noContent().build())
                .onErrorResume(NotFoundException.class, e -> notFound().build())
                .onErrorResume(e -> badRequest().bodyValue("Error deleting SeatType: " + e.getMessage()));
    }
}