package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.DesaffiliateDTO;
import world.inclub.wallet.api.dtos.response.PaymentDueItem;
import world.inclub.wallet.api.dtos.response.RejectedSuscriptionResponse;
import world.inclub.wallet.domain.entity.AffiliatePay;

import java.util.List;

public interface IAffiliatePayPort {

    Mono<AffiliatePay> saveAffiliatePay(AffiliatePayDTO affiliatePayDTO);

    Mono<AffiliatePay> saveDesaffiliatePay(DesaffiliateDTO affiliate);

    Flux<AffiliatePay> getAllAffiliatePay(Long idUser);

    Mono<AffiliatePay> finDyId(Long id);

}
