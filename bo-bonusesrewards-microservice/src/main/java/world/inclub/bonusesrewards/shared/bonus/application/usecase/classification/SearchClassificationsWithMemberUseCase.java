package world.inclub.bonusesrewards.shared.bonus.application.usecase.classification;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface SearchClassificationsWithMemberUseCase {
    Mono<PagedData<ClassificationSummary>> searchClassifications(
            String member,
            Long rankId,
            Boolean notificationStatus,
            Pageable pageable
    );
}