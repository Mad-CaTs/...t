package world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.response.RankResponse;

@Component
public class RankMapper {

    public Rank toDomain(RankResponse response) {
        if (response == null) return null;
        return new Rank(
                response.idRange(),
                response.name(),
                response.position()
        );
    }

}
