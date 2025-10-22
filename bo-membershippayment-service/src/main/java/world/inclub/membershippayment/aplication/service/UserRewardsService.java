package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.UserRewards;
import world.inclub.membershippayment.infraestructure.repository.UserRewardsRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRewardsService {

    private final UserRewardsRepository repository;

    public Mono<UserRewards> updateRewards(Integer idUser, int rewardsDelta) {
        return repository.findByIdUser(idUser)
            .switchIfEmpty(Mono.defer(() -> {
                UserRewards newRewards = UserRewards.builder()
                        .idUser(idUser)
                        .rewards(0)
                        .build();
                return repository.save(newRewards);
            }))
            .flatMap(userRewards -> {
                int newRewardsValue = (userRewards.getRewards() != null ? userRewards.getRewards() : 0) + rewardsDelta;
                userRewards.setRewards(newRewardsValue);
                return repository.save(userRewards);
            });
    }

    public Mono<UserRewards> getRewardsByUser(Integer idUser) {
         return repository.findByIdUser(idUser);
    }
}
