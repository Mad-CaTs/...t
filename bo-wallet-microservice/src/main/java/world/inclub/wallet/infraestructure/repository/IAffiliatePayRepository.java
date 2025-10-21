package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SuscriptionDTO;
import world.inclub.wallet.api.dtos.response.RejectedSuscriptionResponse;
import world.inclub.wallet.domain.entity.AffiliatePay;

import java.time.LocalDateTime;

@Repository
public interface IAffiliatePayRepository extends ReactiveCrudRepository<AffiliatePay, Long>{

    Mono<AffiliatePay> findOneByIdAffiliatePay(Long idSuscription);

    @Query("SELECT idpackage, idpackagedetail FROM BO_MEMBERSHIP.SUSCRIPTION WHERE idsuscription = :idsuscription;")
    Mono<SuscriptionDTO> findBySuscription(@Param("idsuscription") Long idsuscription);

    @Query("""
        SELECT ba.*, bw.* 
        FROM bo_wallet.affiliatepay AS ba
        LEFT JOIN bo_wallet.wallet AS bw ON ba.idwallet = bw.idwallet
        WHERE ba.status = true AND bw.iduser = :idUser
    """)
    Flux<AffiliatePay> getAllAffiliatePay(@Param("idUser") Long idUser);

    @Query("SELECT * FROM bo_wallet.affiliatepay WHERE DATE(dateaffiliate) = CURRENT_DATE and status = true")
    Flux<AffiliatePay> getAllAffiliatePayToday();

    @Query("SELECT EXISTS(select 1 from bo_wallet.affiliatepay as ba  where ba.idwallet = :idWallet and ba.idsuscription = :idSuscription and ba.idpackage = :idPackage and ba.status = :isActive) ")
    Mono<Boolean> existsByNamePackage(Long idWallet, Long idSuscription, Long idPackage,  Boolean isActive);

    Mono<AffiliatePay> findByStatusIsTrueAndIdReasonIsNotNullAndIdAffiliatePay(Long idAffiliatePay);

    Mono<AffiliatePay> findByIdWalletAndIdSuscriptionAndIdPackageAndStatus(Long idWallet, Long idSuscription, Long idPackage, Boolean status);

}
