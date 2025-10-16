package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.LoginRequestDto;
import world.inclub.ticket.api.dto.UsersRequestDto;
import world.inclub.ticket.api.dto.UsersResponseDto;
import world.inclub.ticket.api.dto.UserStatusResponseDto;
import world.inclub.ticket.api.dto.UpdateProfileRequestDto;
import world.inclub.ticket.api.dto.CreateUserRequestDto;
import world.inclub.ticket.api.dto.DocumentTypeResponseDto;
import world.inclub.ticket.api.dto.ChangePasswordRequestDto;
import world.inclub.ticket.application.service.UsersService;
import world.inclub.ticket.infraestructure.exceptions.DuplicateResourceException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsersHandler {

    private final UsersService usersService;

    public Mono<ServerResponse> create(ServerRequest request) {
        return request.bodyToMono(UsersRequestDto.class)
                .flatMap(dto -> usersService.create(dto))
                .flatMap(response -> ServerResponse.created(request.uri())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(DuplicateResourceException.class, e -> 
                    ServerResponse.badRequest()
                            .bodyValue(e.getMessage()))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al crear el usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(usersService.getAll(), UsersResponseDto.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        return usersService.getById(id)
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener el usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        UUID updatedBy = UUID.randomUUID();
        return request.bodyToMono(UsersRequestDto.class)
                .flatMap(dto -> usersService.update(id, dto, updatedBy))
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al actualizar el usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        return usersService.deleteById(id)
                .then(ServerResponse.noContent().build())
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al eliminar el usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> login(ServerRequest request) {
        return request.bodyToMono(LoginRequestDto.class)
                .flatMap(dto -> usersService.login(dto))
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.status(401)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue("Credenciales inválidas"))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue("Error al iniciar sesión: " + e.getMessage()));
    }

    public Mono<ServerResponse> getUserInfo(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        return usersService.getUserInfo(id)
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener la información del usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> updateProfile(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        UUID updatedBy = UUID.randomUUID(); // En un caso real, esto vendría del token JWT
        
        return request.bodyToMono(UpdateProfileRequestDto.class)
                .flatMap(dto -> usersService.updateProfile(id, dto, updatedBy))
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(DuplicateResourceException.class, e -> ServerResponse.badRequest()
                        .bodyValue(e.getMessage()))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al actualizar el perfil: " + e.getMessage()));
    }

    public Mono<ServerResponse> createUser(ServerRequest request) {
        UUID createdBy = UUID.randomUUID(); // En un caso real, esto vendría del token JWT
        
        return request.bodyToMono(CreateUserRequestDto.class)
                .flatMap(dto -> usersService.createUser(dto, createdBy))
                .flatMap(response -> ServerResponse.created(request.uri())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(DuplicateResourceException.class, e -> ServerResponse.badRequest()
                        .bodyValue(e.getMessage()))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al crear el usuario: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAllDocumentTypes(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(usersService.getAllDocumentTypes()
                        .map(documentType -> DocumentTypeResponseDto.builder()
                                .id(documentType.id())
                                .name(documentType.name())
                                .countryId(documentType.countryId())
                                .build()), DocumentTypeResponseDto.class);
    }

    public Mono<ServerResponse> changePassword(ServerRequest request) {
        Integer id = Integer.parseInt(request.pathVariable("id"));
        UUID updatedBy = UUID.randomUUID(); // En un caso real, esto vendría del token JWT
        
        return request.bodyToMono(ChangePasswordRequestDto.class)
                .flatMap(dto -> usersService.changePassword(id, dto, updatedBy))
                .flatMap(response -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(response))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(IllegalArgumentException.class, e -> ServerResponse.badRequest()
                        .bodyValue(e.getMessage()))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al cambiar la contraseña: " + e.getMessage()));
    }

}