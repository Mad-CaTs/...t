package world.inclub.membershippayment.infraestructure.apisExternas.collaborator;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.dtos.CollaboratorValidationDetailDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.dtos.CollaboratorValidationResponseDTO;

@Service
@Slf4j
public class CollaboratorService {

    private final WebClient webClient;

    public CollaboratorService(@Qualifier("collaboratorWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    /** Llama al micro de colaboradores y trae todo el detalle. */
    public Mono<CollaboratorValidationDetailDTO> validateCollaborator(String dni) {
        return webClient.get()
                .uri("/validate/{dni}", dni)
                .retrieve()
                .bodyToMono(CollaboratorValidationDetailDTO.class);
    }

    /** Devuelve un DTO wrapper*/
    public Mono<CollaboratorValidationResponseDTO> validateDni(String dni) {
        return validateCollaborator(dni)
                .map(d -> new CollaboratorValidationResponseDTO(d.isCollaborator()))
                .timeout(java.time.Duration.ofSeconds(8))
                .onErrorResume(ex -> {
                    log.warn("No se pudo validar DNI {} en Collaborators API, se asume NO colaborador. Motivo: {}",
                            dni, ex.getMessage());
                    return Mono.just(new CollaboratorValidationResponseDTO(false));
                });
    }

    /** el flag booleano. */
    public Mono<Boolean> isCollaborator(String dni) {
        return validateDni(dni)
                .map(CollaboratorValidationResponseDTO::isCollaborator);
    }
}

