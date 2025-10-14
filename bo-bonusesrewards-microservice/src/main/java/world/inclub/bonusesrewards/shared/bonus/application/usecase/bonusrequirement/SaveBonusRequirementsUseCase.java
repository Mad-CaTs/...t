package world.inclub.bonusesrewards.shared.bonus.application.usecase.bonusrequirement;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;

import java.util.List;

public interface SaveBonusRequirementsUseCase {
    Flux<BonusRequirement> saveBonusRequirements(List<BonusRequirement> requirements);
}