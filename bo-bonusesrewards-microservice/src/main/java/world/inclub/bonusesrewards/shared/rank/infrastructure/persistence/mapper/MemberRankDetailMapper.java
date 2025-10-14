package world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.response.MemberRankDetailResponse;

@Component
public class MemberRankDetailMapper {

    public MemberRankDetail toDomain(MemberRankDetailResponse response) {
        if (response == null) return null;
        return new MemberRankDetail(
                response.socioId(),
                response.idRange(),
                response.rango()
        );
    }

}
