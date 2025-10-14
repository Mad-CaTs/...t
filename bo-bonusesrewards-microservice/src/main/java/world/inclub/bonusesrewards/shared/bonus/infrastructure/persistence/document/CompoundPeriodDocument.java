package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.document;

import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder(toBuilder = true)
@Document(collection = "period_compound")
public record CompoundPeriodDocument(
        @Id String id,
        @Field("id_user") Long userId,
        @Field("id_range") Long rankId,
        @Field("range") String rankName,
        @Field("period_id") Long periodId,
        @Field("points1") Double pointsBranch1,
        @Field("points2") Double pointsBranch2,
        @Field("points3") Double pointsBranch3,
        @Field("points_direct1") Double directPointsBranch1,
        @Field("points_direct2") Double directPointsBranch2,
        @Field("points_direct3") Double directPointsBranch3,
        @Field("id_state") Long stateId
) {}
