package world.inclub.bonusesrewards.shared.bonus.application.usecase.classification;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;

public interface GetAllClassificationWithMemberUseCase {
    Flux<ClassificationSummary> getAll(String member, Long rankId, Boolean notificationStatus);
}