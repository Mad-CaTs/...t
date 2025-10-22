package world.inclub.membershippayment.infraestructure.apisExternas.collaborator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.dtos.CollaboratorValidationResponseDTO;
import world.inclub.membershippayment.infraestructure.user.UserService;

@RestController
@RequestMapping("/api/v1/collaborators")
@RequiredArgsConstructor
@Slf4j
public class CollaboratorValidationController {

    private final UserService userService;
    private final CollaboratorService collaboratorService;

    @GetMapping("/validateByUserId/{userId}")
    public Mono<ResponseEntity<CollaboratorValidationResponseDTO>> validateByUserId(@PathVariable Integer userId) {
        return userService.findById(userId)
                .flatMap(user -> {
                    if (user == null || user.getNroDocument() == null) {
                        log.warn("Usuario con ID {} no encontrado o sin nroDocument (DNI)", userId);
                        return Mono.just(ResponseEntity.ok(new CollaboratorValidationResponseDTO(false)));
                    }
                    return collaboratorService.validateDni(user.getNroDocument())
                            .map(res -> ResponseEntity.ok(res));
                })
                .defaultIfEmpty(ResponseEntity.ok(new CollaboratorValidationResponseDTO(false)));
    }
}

