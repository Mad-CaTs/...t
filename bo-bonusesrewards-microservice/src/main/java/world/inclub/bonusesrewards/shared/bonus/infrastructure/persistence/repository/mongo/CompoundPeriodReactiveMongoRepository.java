package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.document.CompoundPeriodDocument;

import java.util.List;

public interface CompoundPeriodReactiveMongoRepository
        extends ReactiveMongoRepository<CompoundPeriodDocument, String> {

    @Aggregation(pipeline = {
            "{ $match: { period_id: { $gte: ?0, $lte: ?1 }, id_range: ?2, id_state: { $gte: ?3 } } }",
            "{ $sort: { id_user: 1, id_range: 1, period_id: -1 } }",
            "{ $group: { " +
                    "_id: '$id_user', " +
                    "rankId: { $first: '$id_range' }, " +
                    "rankName: { $first: '$range' }, " +
                    "periods: { $push: '$period_id' }, " +
                    "totalDirectPoints: { $first: { $add: [ " +
                    "{ $ifNull: ['$points_direct1', 0] }, " +
                    "{ $ifNull: ['$points_direct2', 0] }, " +
                    "{ $ifNull: ['$points_direct3', 0] } ] } } " +
                    "} }",
            "{ $project: { " +
                    "userId: '$_id', " +
                    "rankId: 1, " +
                    "rankName: 1, " +
                    "totalDirectPoints: 1, " +
                    "numRequalifications: { $subtract: [ { $size: '$periods' }, 1 ] }, " +
                    "startPeriod: { $min: '$periods' }, " +
                    "endPeriod: { $max: '$periods' } " +
                    "} }",
            "{ $match: { userId: { $ne: null }, numRequalifications: { $gte: ?4 } } }",
            "{ $sort: { totalDirectPoints: -1 } }"
    })
    Flux<PrequalificationResult> findTopRequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long stateMin,
            Long minRequalifications
    );

    @Aggregation(pipeline = {
            "{ $match: { period_id: { $gte: ?0, $lte: ?1 }, id_range: ?2, id_state: { $gte: ?3 } } }",
            "{ $sort: { id_user: 1, id_range: 1, period_id: -1 } }",
            "{ $group: { " +
                    "_id: '$id_user', " +
                    "rankId: { $first: '$id_range' }, " +
                    "rankName: { $first: '$range' }, " +
                    "periods: { $push: '$period_id' }, " +
                    "totalDirectPoints: { $first: { $add: [ " +
                    "{ $ifNull: ['$points_direct1', 0] }, " +
                    "{ $ifNull: ['$points_direct2', 0] }, " +
                    "{ $ifNull: ['$points_direct3', 0] } ] } } " +
                    "} }",
            "{ $project: { " +
                    "userId: '$_id', " +
                    "rankId: 1, " +
                    "rankName: 1, " +
                    "totalDirectPoints: 1, " +
                    "numRequalifications: { $subtract: [ { $size: '$periods' }, 1 ] }, " +
                    "startPeriod: { $min: '$periods' }, " +
                    "endPeriod: { $max: '$periods' } " +
                    "} }",
            "{ $match: { userId: { $ne: null }, numRequalifications: { $gte: ?4 } } }",
            "{ $sort: { totalDirectPoints: -1 } }",
            "{ $skip: ?5 }",
            "{ $limit: ?6 }"
    })
    Flux<PrequalificationResult> findTopRequalificationsPaginated(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long stateMin,
            Long minRequalifications,
            Integer skip,
            Integer limit
    );

    @Aggregation(pipeline = {
            "{ $match: { period_id: { $gte: ?0, $lte: ?1 }, id_range: ?2, id_state: { $gte: ?3 } } }",
            "{ $sort: { id_user: 1, id_range: 1, period_id: -1 } }",
            "{ $group: { " +
                    "_id: '$id_user', " +
                    "rankId: { $first: '$id_range' }, " +
                    "rankName: { $first: '$range' }, " +
                    "periods: { $push: '$period_id' }, " +
                    "totalDirectPoints: { $first: { $add: [ " +
                    "{ $ifNull: ['$points_direct1', 0] }, " +
                    "{ $ifNull: ['$points_direct2', 0] }, " +
                    "{ $ifNull: ['$points_direct3', 0] } ] } } " +
                    "} }",
            "{ $project: { " +
                    "userId: '$_id', " +
                    "rankId: 1, " +
                    "rankName: 1, " +
                    "totalDirectPoints: 1, " +
                    "numRequalifications: { $subtract: [ { $size: '$periods' }, 1 ] }, " +
                    "startPeriod: { $min: '$periods' }, " +
                    "endPeriod: { $max: '$periods' } " +
                    "} }",
            "{ $match: { userId: { $ne: null }, numRequalifications: { $gte: ?4 } } }",
            "{ $count: 'total' }"
    })
    Mono<Long> countPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long stateMin,
            Long minRequalifications
    );

    @Aggregation(pipeline = {
            "{ $match: { id_user: { $in: ?0 }, period_id: { $gte: ?1, $lte: ?2 }, id_range: ?3, id_state: { $gte: ?4 } } }",
            "{ $sort: { id_user: 1, id_range: 1, period_id: -1 } }",
            "{ $group: { " +
                    "_id: '$id_user', " +
                    "rankId: { $first: '$id_range' }, " +
                    "rankName: { $first: '$range' }, " +
                    "periods: { $push: '$period_id' }, " +
                    "totalDirectPoints: { $first: { $add: [ " +
                    "{ $ifNull: ['$points_direct1', 0] }, " +
                    "{ $ifNull: ['$points_direct2', 0] }, " +
                    "{ $ifNull: ['$points_direct3', 0] } ] } } " +
                    "} }",
            "{ $project: { " +
                    "userId: '$_id', " +
                    "rankId: 1, " +
                    "rankName: 1, " +
                    "totalDirectPoints: 1, " +
                    "numRequalifications: { $subtract: [ { $size: '$periods' }, 1 ] }, " +
                    "startPeriod: { $min: '$periods' }, " +
                    "endPeriod: { $max: '$periods' } " +
                    "} }",
            "{ $match: { userId: { $ne: null }, numRequalifications: { $gte: ?5 } } }",
            "{ $sort: { totalDirectPoints: -1 } }"
    })
    Flux<PrequalificationResult> findByMemberIds(
            List<Long> memberIds,
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long stateMin,
            Long minRequalifications
    );

    @Aggregation(pipeline = {
            "{ $match: { id_user: ?0, id_range: { $in: ?1 }, id_state: 1 } }",
            "{ $sort: { id_user: 1, id_range: 1, period_id: -1 } }",
            "{ $group: { " +
                    "_id: '$id_user', " +
                    "rankId: { $first: '$id_range' }, " +
                    "rankName: { $first: '$range' }, " +
                    "periods: { $push: '$period_id' }, " +
                    "totalDirectPoints: { $first: { $add: [ " +
                    "{ $ifNull: ['$points_direct1', 0] }, " +
                    "{ $ifNull: ['$points_direct2', 0] }, " +
                    "{ $ifNull: ['$points_direct3', 0] } ] } } " +
                    "} }",
            "{ $project: { " +
                    "userId: '$_id', " +
                    "rankId: 1, " +
                    "rankName: 1, " +
                    "totalDirectPoints: 1, " +
                    "numRequalifications: { $subtract: [ { $size: '$periods' }, 1 ] }, " +
                    "startPeriod: { $min: '$periods' }, " +
                    "endPeriod: { $max: '$periods' } " +
                    "} }",
            "{ $match: { userId: { $ne: null } } }",
            "{ $sort: { totalDirectPoints: -1 } }"
    })
    Flux<PrequalificationResult> findByMemberIdAndRankIds(
            Long memberId,
            List<Long> rankIds
    );

}
