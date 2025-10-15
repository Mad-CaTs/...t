package world.inclub.bonusesrewards.shared.bonus.application.mapper;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.util.function.Tuple2;
import world.inclub.bonusesrewards.shared.bonus.application.dto.PrequalificationSummary;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Prequalification;
import world.inclub.bonusesrewards.shared.bonus.domain.util.BonusRequirementFinder;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;

import java.util.List;
import java.util.Map;

@Component
public class PrequalificationSummaryMapper {

    public Flux<PrequalificationSummary> toSummary(
            List<Prequalification> prequalifications,
            Map<Long, Tuple2<Member, String>> membersMap,
            Map<Long, Period> periodsMap,
            List<MemberRankDetail>  currentRanksMap,
            List<BonusRequirement> bonusRequirements
    ) {

        return Flux.fromIterable(prequalifications)
                .mapNotNull(prequalification -> {
                    Tuple2<Member, String> memberTuple = membersMap.get(prequalification.userId());

                    BonusRequirement requirement = BonusRequirementFinder.findMatchingRequirement(
                            bonusRequirements,
                            prequalification.rankId(),
                            prequalification.numRequalifications()
                    );

                    if (memberTuple == null || requirement == null) {
                        return null;
                    }

                    Member member = memberTuple.getT1();
                    String countryOfResidence = memberTuple.getT2();
                    String currentRankName = currentRanksMap.stream()
                            .filter(r -> r.memberId().equals(member.id()))
                            .map(MemberRankDetail::rankName)
                            .findFirst()
                            .orElse("Unknown");

                    Long achievedPoints = prequalification.totalDirectPoints().longValue();
                    Long requiredPoints = requirement.directPoints().longValue();
                    Long missingPoints = Math.max(0, requiredPoints - achievedPoints);

                    Period startPeriod = periodsMap.get(prequalification.startPeriod());
                    Period endPeriod = periodsMap.get(prequalification.endPeriod());

                    return new PrequalificationSummary(
                            member.id(),
                            member.username(),
                            member.name() + " " + member.lastName(),
                            countryOfResidence,
                            member.email(),
                            member.phoneNumber(),
                            prequalification.rankName(),
                            currentRankName,
                            achievedPoints,
                            requiredPoints,
                            missingPoints,
                            startPeriod.startAt(),
                            endPeriod.endAt(),
                            prequalification.numRequalifications()
                    );
                });
    }
}