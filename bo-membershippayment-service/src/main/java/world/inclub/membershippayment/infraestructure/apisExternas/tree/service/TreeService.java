package world.inclub.membershippayment.infraestructure.apisExternas.tree.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TreeService {

    private final KafkaTemplate<String, Object> kafkaTemplate;


    public Mono<Boolean> synchronizeMembershipDataForRegister(Suscription suscription, List<Payment> payments, PackageDTO packageDTO, boolean isBuy) {

        if (isBuy== false) {
            return Mono.just(false);
        }

        Membership result = new Membership();
        result.setIdPackage(suscription.getIdPackage());
        result.setIdPackageDetail(suscription.getIdPackageDetail());
        result.setStatus(suscription.getStatus());
        result.setIdMembership(suscription.getIdSuscription().intValue());
        result.setNamePackage(packageDTO.getName());
        result.setPoints(packageDTO.getPackageDetail().get(0).getVolume());
        result.setPointsByFee(packageDTO.getPackageDetail().get(0).getVolumeByFee());
        result.setIdUser(suscription.getIdUser());

        return  Flux.fromIterable(payments)
                //POr tema de migraciones
                .filter(payment -> payment.getPositionOnSchedule() != 0)
                .filter(payment -> payment.getIdStatePayment() != 0 && payment.getIsInitialQuote() == 0)
                .collectList()
                .flatMap(filteredPayments -> {

                    int pay ;

                    if (filteredPayments.isEmpty()) {
                        pay = 1;
                    }else{
                        pay = 0;
                    }

                    result.setPay(pay);

                    kafkaTemplate.send("topic-membership-state",  result);
                    return Mono.just(true);
                });

    }

    public Mono<Boolean> synchronizeMembershipDataForPay(Suscription suscription,List<Payment> payments) {

        Payment star = payments.get(0);

        if (star.getIdStatePayment() == 1){

            Membership result = new Membership();
            result.setIdPackage(suscription.getIdPackage());
            result.setIdPackageDetail(suscription.getIdPackageDetail());
            result.setStatus(star.getIdStatePayment());
            result.setIdMembership(suscription.getIdSuscription().intValue());
            result.setIdUser(suscription.getIdUser());
            result.setPay(1);

            return Flux.fromIterable(payments)
                    .filter(payment -> payment.getIdStatePayment() != 0 && payment.getIsInitialQuote() == 0)
                    .hasElements()
                    .flatMap(hasElements -> {
                        if (hasElements) {
                            // Si existen elementos, realiza una acción específica
                            log.info("caso 1");
                            result.setPay(0);
                            kafkaTemplate.send("topic-membership-state", result);
                            return Mono.just(true);
                        } else {
                            log.info("caso 2");
                            kafkaTemplate.send("topic-membership-state", result);
                            return Mono.just(false);
                        }
                    });



        }
        return Mono.just(false);

    }

}
