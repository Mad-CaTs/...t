package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail.GetCarQuotationDetailByClassificationIdUseCase;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.Quotation;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(Quotation.DETAIL)
public class CarQuotationDetailController {

    private final GetCarQuotationDetailByClassificationIdUseCase getCarQuotationDetailByClassificationIdUseCase;

    @GetMapping("/{classificationId}")
    public Mono<ResponseEntity<ApiResponse<List<CarQuotationDetail>>>> healthCheck(@PathVariable UUID classificationId) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarQuotationDetailByClassificationIdUseCase.getByClassificationId(classificationId),
                true
        );
    }

}
