package world.inclub.bonusesrewards.shared.bonus.application.usecase.classification;

import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NotifyMembersUseCase {

    Mono<Void> notifyClassifiedMembers(List<UUID> classificationIds);

}
