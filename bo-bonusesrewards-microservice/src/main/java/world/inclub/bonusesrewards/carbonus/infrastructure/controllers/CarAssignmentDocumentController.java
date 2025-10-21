package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.AssignmentDocuments;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentDocumentRequest;
import world.inclub.bonusesrewards.shared.exceptions.RequiredFieldException;
import world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure.FilePartAdapter;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(AssignmentDocuments.BASE)
public class CarAssignmentDocumentController {

    private final CreateCarAssignmentDocumentUseCase createCarAssignmentDocumentUseCase;
    private final UpdateCarAssignmentDocumentUseCase updateCarAssignmentDocumentUseCase;
    private final DeleteCarAssignmentDocumentUseCase deleteCarAssignmentDocumentUseCase;
    private final FilePartAdapter filePartAdapter;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<CarAssignmentDocument>>> create(
            @Valid @ModelAttribute CarAssignmentDocumentRequest request
    ) {
        CarAssignmentDocument document = CarAssignmentDocument.builder()
                .carAssignmentId(request.carAssignmentId())
                .documentTypeId(request.documentTypeId())
                .build();
        Mono<CarAssignmentDocument> mono = filePartAdapter.from(request.documentFile())
                .switchIfEmpty(Mono.error(new RequiredFieldException("Document file is required")))
                .flatMap(fileResource -> createCarAssignmentDocumentUseCase
                        .create(document, fileResource));
        return ResponseHandler.generateResponse(HttpStatus.CREATED, mono, true);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<CarAssignmentDocument>>> update(
            @PathVariable UUID id,
            @Valid @ModelAttribute CarAssignmentDocumentRequest request
    ) {
        CarAssignmentDocument document = CarAssignmentDocument.builder()
                .carAssignmentId(request.carAssignmentId())
                .documentTypeId(request.documentTypeId())
                .build();

        Mono<CarAssignmentDocument> mono = request.documentFile() == null
                ? updateCarAssignmentDocumentUseCase.update(id, document, null)
                : filePartAdapter.from(request.documentFile())
                .flatMap(fileResource -> updateCarAssignmentDocumentUseCase
                        .update(id, document, fileResource));

        return ResponseHandler.generateResponse(HttpStatus.OK, mono, true);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable UUID id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK, deleteCarAssignmentDocumentUseCase.deleteById(id)
                        .thenReturn("Document deleted successfully"), true);
    }

}