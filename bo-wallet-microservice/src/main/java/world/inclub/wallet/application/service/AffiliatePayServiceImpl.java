package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.DesaffiliateDTO;
import world.inclub.wallet.application.service.interfaces.IAffiliatePayService;
import world.inclub.wallet.domain.entity.AffiliatePay;
import world.inclub.wallet.domain.port.IAffiliatePayPort;

@Slf4j
@Service
@RequiredArgsConstructor
public class AffiliatePayServiceImpl implements IAffiliatePayService {

    private final IAffiliatePayPort iAffiliatePayTransactionPort;

    @Override
    public Mono<AffiliatePay> generateAffiliatePay(AffiliatePayDTO affiliatePayDTO){
        return iAffiliatePayTransactionPort.saveAffiliatePay(affiliatePayDTO);

    }

    @Override
    public Mono<AffiliatePay> generateDesaffiliatePay(DesaffiliateDTO afiliate){
        return iAffiliatePayTransactionPort.saveDesaffiliatePay(afiliate);

    }

    @Override
    public Flux<AffiliatePay> getAffiliatePay(Long idUser) {
        return iAffiliatePayTransactionPort.getAllAffiliatePay(idUser);
    }

    @Override
    public Mono<AffiliatePay> getAffiliatePayById(Long id) {
        return iAffiliatePayTransactionPort.finDyId(id);
    }


}
