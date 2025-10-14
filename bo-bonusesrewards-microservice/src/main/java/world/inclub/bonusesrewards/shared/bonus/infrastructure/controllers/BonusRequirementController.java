package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.bonusrequirement.SaveBonusRequirementsUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.constants.BonusApiPaths.Requirements;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request.BonusRequirementRequest;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.BonusRequirementResponse;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper.BonusRequirementControllerMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;

@RestController
@RequestMapping(Requirements.BASE)
@RequiredArgsConstructor
public class BonusRequirementController {

    private final SaveBonusRequirementsUseCase saveBonusRequirementsUseCase;
    private final BonusRequirementControllerMapper requirementMapper;

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<List<BonusRequirementResponse>>>> create(@Valid @RequestBody List<BonusRequirementRequest> requests) {
        List<BonusRequirement> requirements = requests.stream()
                .map(requirementMapper::toDomain)
                .toList();
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                saveBonusRequirementsUseCase.saveBonusRequirements(requirements)
                        .map(requirementMapper::toResponse),
                true
        );
    }
}