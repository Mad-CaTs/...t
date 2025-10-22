package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.dto.request.SuscriptionCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponDTO;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponTotalDTO;
import world.inclub.membershippayment.domain.entity.SubscriptionCoupon;

public interface ISuscriptionCouponDao {

    Flux<ResponseCouponDTO> getAllCouponsPaginateAndSearch(Boolean isparner , Integer page, Integer size, String search, Integer idbusiness);
    Mono<SubscriptionCoupon> findByStateIsTrueAndCode(String code );
    Mono<SubscriptionCoupon> findByIdSuscriptionAndUserId(Integer idSuscription, Integer iduser );
    Mono<SubscriptionCoupon> createCoupon(SuscriptionCouponRequest suscriptionCoupon);
    Mono<SubscriptionCoupon> updateCoupon(SuscriptionCouponRequest suscriptionCoupon, Integer idcoupon);
    Mono<Boolean> deleteCouponByIdentity(Integer id);
    Mono<ResponseCouponTotalDTO>  findByCustomiserParamsAllPag(Boolean ispartner, String search, Integer idbusiness);
}
