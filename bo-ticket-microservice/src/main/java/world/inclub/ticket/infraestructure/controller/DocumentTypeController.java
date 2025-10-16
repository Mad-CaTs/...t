package world.inclub.ticket.infraestructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.ports.DocumentTypeRepositoryPort;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/document/types")
public class DocumentTypeController {

    private final DocumentTypeRepositoryPort documentTypeRepositoryPort;

    @GetMapping("/all")
    public Mono<ResponseEntity<Object>> getAllDocumentTypes() {
        return ResponseHandler.generateResponse(HttpStatus.CREATED, documentTypeRepositoryPort.findAllDocumentTypes(), true);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Object>> getDocumentTypeById(@PathVariable(value = "id") Integer id) {
        return ResponseHandler.generateResponse(HttpStatus.CREATED, documentTypeRepositoryPort.findDocumentTypeById(id), true);
    }

}
