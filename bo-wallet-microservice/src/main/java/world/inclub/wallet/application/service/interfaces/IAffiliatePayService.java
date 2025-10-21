package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.DesaffiliateDTO;
import world.inclub.wallet.api.dtos.response.PaymentDueItem;
import world.inclub.wallet.api.dtos.response.RejectedSuscriptionResponse;
import world.inclub.wallet.domain.entity.AffiliatePay;

import java.util.List;

public interface IAffiliatePayService {

    Mono<AffiliatePay> generateAffiliatePay(AffiliatePayDTO affiliatePayDTO);

    Mono<AffiliatePay> generateDesaffiliatePay(DesaffiliateDTO affiliatePay);

    Flux<AffiliatePay> getAffiliatePay(Long idUser);

    Mono<AffiliatePay> getAffiliatePayById(Long id);


}
