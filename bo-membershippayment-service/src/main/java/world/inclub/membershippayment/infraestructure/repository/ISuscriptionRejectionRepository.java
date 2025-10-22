package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import world.inclub.membershippayment.domain.dto.response.RejectedSuscriptionResponse;

import java.time.LocalDateTime;

public interface ISuscriptionRejectionRepository extends ReactiveCrudRepository<RejectedSuscriptionResponse, Integer> {

    @Query("""
        SELECT
          scp.iduser            AS id_user, 
          scp.idsuscription     AS id_suscription,  
          pym.idpayment         AS id_payment, 
          pym.quoteusd          AS quote,  
          pym.positiononschedule AS position, 
          wat.availablebalance   AS saldo_disponible, 
          wat.accountingbalance  AS cuenta_contable
        FROM
          bo_membership.payment AS pym
        RIGHT JOIN
          bo_membership.suscription AS scp
          ON scp.idsuscription = pym.idsuscription
        LEFT JOIN bo_wallet.wallet as wat
            ON wat.iduser = scp.iduser
        WHERE
          pym.idsuscription IN (SELECT idsuscription FROM bo_wallet.affiliatepay where idreason isnull)
          AND pym.nextexpirationdate BETWEEN :fstart AND :fend
          AND pym.idstatepayment = 0
        ORDER BY
          pym.positiononschedule ASC, scp.iduser ASC
    """)
    Flux<RejectedSuscriptionResponse> getAllPaymentSuscriptions(
            @Param("fstart") LocalDateTime fstart,
            @Param("fend") LocalDateTime fend
    );

}
