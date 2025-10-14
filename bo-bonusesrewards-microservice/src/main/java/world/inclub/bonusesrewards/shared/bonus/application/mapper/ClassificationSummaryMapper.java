package world.inclub.bonusesrewards.shared.bonus.application.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;
import world.inclub.bonusesrewards.shared.bonus.domain.model.ClassificationWithMember;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ClassificationSummaryMapper {

    public ClassificationSummary toSummary(
            ClassificationWithMember classificationWithMember,
            List<Period> periods,
            List<MemberRankDetail> memberRanks,
            List<Rank> ranks
    ) {
        Map<Long, Period> periodMap = periods.stream()
                .collect(Collectors.toMap(Period::id, Function.identity()));

        Map<Long, MemberRankDetail> memberRankMap = memberRanks.stream()
                .collect(Collectors.toMap(MemberRankDetail::memberId, Function.identity()));

        Map<Long, Rank> rankMap = ranks.stream()
                .collect(Collectors.toMap(Rank::id, Function.identity()));

        Period startPeriod = periodMap.get(classificationWithMember.startPeriodId());
        Period endPeriod = periodMap.get(classificationWithMember.endPeriodId());
        Rank rank = rankMap.get(classificationWithMember.rankId());
        MemberRankDetail currentRankDetail = memberRankMap.get(classificationWithMember.memberId());
        Rank currentRank = currentRankDetail != null ? rankMap.get(currentRankDetail.rankId()) : null;

        return new ClassificationSummary(
                classificationWithMember.classificationId(),
                classificationWithMember.memberId(),
                classificationWithMember.username(),
                classificationWithMember.fullName(),
                classificationWithMember.countryOfResidence(),
                classificationWithMember.email(),
                classificationWithMember.phone(),
                getRankName(rank),
                getRankName(currentRank),
                classificationWithMember.achievedPoints(),
                classificationWithMember.requiredPoints(),
                classificationWithMember.requalificationCycles(),
                classificationWithMember.classificationDate(),
                classificationWithMember.notificationStatus(),
                startPeriod != null ? startPeriod.startAt() : null,
                endPeriod != null ? endPeriod.endAt() : null
        );
    }

    private String getRankName(Rank rank) {
        return rank != null ? rank.name() : "Unknown";
    }
}