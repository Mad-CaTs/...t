package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.Quotation;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CreateCarQuotationRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.UpdateCarQuotationRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation.CarQuotationRequestMapper;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure.FilePartAdapter;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(Quotation.BASE)
public class CarQuotationController {

    private final SaveCarQuotationUseCase saveCarQuotationUseCase;
    private final UpdateCarQuotationUseCase updateCarQuotationUseCase;
    private final DeleteCarQuotationByIdUseCase deleteCarQuotationByIdUseCase;

    private final FilePartAdapter filePartAdapter;
    private final CarQuotationRequestMapper carQuotationRequestMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<String>>> createProforma(
            @Valid @ModelAttribute CreateCarQuotationRequest request
    ) {
        CarQuotation domain = carQuotationRequestMapper.toDomain(request);
        Mono<FileResource> fileResource = filePartAdapter.from(request.quotationFile());

        return fileResource
                .flatMap(file -> saveCarQuotationUseCase.save(domain, file))
                .then(ResponseHandler.generateResponse(
                        HttpStatus.OK,
                        "Quotation created successfully",
                        true
                ));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<String>>> updateProforma(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateCarQuotationRequest request
    ) {
        CarQuotation domain = carQuotationRequestMapper.toDomain(request);
        Mono<CarQuotation> response = request.quotationFile() == null
                ? updateCarQuotationUseCase.update(id, domain, null)
                : filePartAdapter.from(request.quotationFile())
                .flatMap(file -> updateCarQuotationUseCase.update(id, domain, file));

        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                response.thenReturn("Quotation updated successfully"),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> deleteProforma(@PathVariable UUID id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                deleteCarQuotationByIdUseCase
                        .deleteById(id)
                        .thenReturn("Quotation deleted successfully"),
                true
        );
    }

}
