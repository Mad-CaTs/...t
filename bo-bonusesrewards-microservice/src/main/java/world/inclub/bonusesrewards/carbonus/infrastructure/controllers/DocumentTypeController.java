package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.documenttypes.*;
import world.inclub.bonusesrewards.carbonus.domain.model.DocumentType;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.DocumentTypes;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;

@RestController
@RequestMapping(DocumentTypes.BASE)
@RequiredArgsConstructor
public class DocumentTypeController {

    private final GetAllDocumentTypesUseCase getAllDocumentTypesUseCase;
    private final GetDocumentTypesByNameUseCase getDocumentTypesByNameUseCase;
    private final GetDocumentTypesByIdUseCase getDocumentTypesByIdUseCase;
    private final CreateDocumentTypesUseCase createDocumentTypesUseCase;
    private final UpdateDocumentTypesUseCase updateDocumentTypesUseCase;
    private final DeleteDocumentTypesUseCase deleteDocumentTypesUseCase;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<List<DocumentType>>>> getAll() {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getAllDocumentTypesUseCase.getAll().collectList(),
                true
        );
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<List<DocumentType>>>> searchByName(@RequestParam String name) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getDocumentTypesByNameUseCase.getByName(name).collectList(),
                true
        );
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<DocumentType>>> getById(@PathVariable Long id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getDocumentTypesByIdUseCase.getById(id),
                true
        );
    }

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<DocumentType>>> create(@RequestBody DocumentType documentType) {
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                createDocumentTypesUseCase.create(documentType),
                true
        );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<DocumentType>>> update(
            @PathVariable Long id,
            @RequestBody DocumentType documentType
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                updateDocumentTypesUseCase.update(id, documentType),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable Long id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                deleteDocumentTypesUseCase.delete(id)
                        .thenReturn("Document type deleted successfully"),
                true
        );
    }

}