package world.inclub.membershippayment.aplication.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.domain.dto.response.AffiliateDTO;
import world.inclub.membershippayment.domain.dto.response.AffiliatePADTO;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.State;

@Service
@Slf4j
@RequiredArgsConstructor
public class AffiliateService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Mono<Boolean> registerAffiliate(UserResponse user, SponsordResponse userSponsor, State stateUser,
            PackageDTO packageDTO, Suscription suscription, Integer cuotasAdelantadas) {

        Integer isInitial = 1;
        if (user.getIdUser() == null || userSponsor.getId() == null) {
            log.info("User or sponsor ID is null");

        }
        if (cuotasAdelantadas != 0 ){
            isInitial = 0;
        }

        AffiliateDTO affiliateDTO = new AffiliateDTO();
        Membership membership = new Membership();

        // affiliateDTO.setIdSon(user.getIdUser());
        affiliateDTO.setIdSponsor(userSponsor.getId());
        affiliateDTO.setStatusSon(stateUser.getValue());
        affiliateDTO.setUserSon(user);
        affiliateDTO.setDateAffiliate(TimeLima.getLimaTime());

        membership.setIdMembership(suscription.getIdSuscription().intValue());
        membership.setIdPackage(packageDTO.getIdPackage());
        membership.setIdPackageDetail(packageDTO.getPackageDetail().get(0).getIdPackageDetail().intValue());
        membership.setStatus(suscription.getStatus());
        membership.setNamePackage(packageDTO.getName());
        membership.setPoints(packageDTO.getPackageDetail().get(0).getVolume());
        membership.setPointsByFee(packageDTO.getPackageDetail().get(0).getVolumeByFee());
        membership.setPay(isInitial);

        affiliateDTO.setMembership(membership);

        AffiliatePADTO affiliatePADTO = new AffiliatePADTO();
        affiliatePADTO.setIdSon(user.getIdUser());
        affiliatePADTO.setIdSponsor(userSponsor.getId());

        kafkaTemplate.send("topic-affiliate", affiliateDTO);
        kafkaTemplate.send("topic-affiliate-pa", affiliatePADTO);
        return Mono.just(true);
    }

}
