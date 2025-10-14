package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.bonusrequirement.SaveBonusRequirementsUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.port.BonusRequirementRepositoryPort;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BonusRequirementService implements
        SaveBonusRequirementsUseCase {

    private final BonusRequirementRepositoryPort requirementRepository;

    @Override
    public Flux<BonusRequirement> saveBonusRequirements(List<BonusRequirement> requirements) {
        return Flux.fromIterable(requirements)
                .flatMap(requirementRepository::save);
    }
}