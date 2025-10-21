package world.inclub.wallet.infraestructure.persistence;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestElectronicPurseResponseDTO;
import world.inclub.wallet.domain.entity.WithDrawalRequestElectronicPurse;
import world.inclub.wallet.domain.port.IWithDrawalRequestElectronicPursePort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.repository.IWithDrawalRequestElectronicPurseRepository;

@Repository
@RequiredArgsConstructor
public class WithDrawalRequestElectronicPurseRepositoryImpl implements IWithDrawalRequestElectronicPursePort {

    private final IWithDrawalRequestElectronicPurseRepository iRepository;
    private final DatabaseClient databaseClient;
    private final KafkaRequestReplyAccountService serviceKafka;

    @Override
    public Mono<WithDrawalRequestElectronicPurse> saveWDRElectrinicPurse(WithDrawalRequestElectronicPurse object) {
        return iRepository.save(object);
    }

    @Override
    public Flux<WithDrawalRequestElectronicPurseResponseDTO> getWDRElectronicPurseByIdUser(Integer idUser) {

        String sql = "SELECT request.*, \r\n" + //
                "       walletTrans.initialdate, \r\n" + //
                "       walletTrans.availabilitydate, \r\n" + //
                "       walletTrans.referencedata, \r\n" + //
                "       walletTrans.amount, \r\n" + //
                "       electronicPur.iduser, \r\n" + //
                "       electronicPur.idelectronicpursecompany, \r\n" + //
                "       electronicPur.holdername, \r\n" + //
                "       electronicPur.holderlastname, \r\n" + //
                "       electronicPur.usernameaccount, \r\n" + //
                "       electronicPur.paidlink, \r\n" + //
                "       requestState.name as nameRequest, \r\n" + //
                "       typeTrans.description AS descriptionTransaction\r\n" + //
                "FROM bo_wallet.withdrawalrequestelectronicpurse request\r\n" + //
                "INNER JOIN bo_wallet.wallettransaction walletTrans \r\n" + //
                "    ON request.idwallettransaction = walletTrans.idwallettransaction\r\n" + //
                "INNER JOIN bo_wallet.electronicpurse electronicPur \r\n" + //
                "    ON request.idelectronicpurse = electronicPur.idelectronicpurse\r\n" + //
                "INNER JOIN bo_wallet.electronicpursecompany companyElectronicPur \r\n" + //
                "    ON electronicPur.idelectronicpursecompany = companyElectronicPur.idelectronicpursecompany\r\n" + //
                "INNER JOIN bo_wallet.requeststates requestState \r\n" + //
                "    ON requestState.idrequeststates = request.idrequeststates\r\n" + //
                "INNER JOIN bo_wallet.typewallettransaction typeTrans \r\n" + //
                "    ON walletTrans.idtypewallettransaction = typeTrans.idtypewallettransaction\r\n" + //
                "WHERE electronicPur.iduser = $1 \r\n" + //
                "ORDER BY walletTrans.initialdate DESC;";

        Flux<WithDrawalRequestElectronicPurseResponseDTO> response = response = databaseClient.sql(sql)
                .bind("$1", idUser)
                .fetch()
                .all()
                .map(this::mapRowToWDRElectronicPurseResponseDTO);
                
        Mono<UserAccountDTO> user = serviceKafka.getUserAccountById(idUser);

                return response.collectList().zipWith(user).flatMapMany(tuple -> {
                    List<WithDrawalRequestElectronicPurseResponseDTO> w = tuple.getT1();
                    UserAccountDTO u = tuple.getT2();
        
                    // Set values from UserAccountDTO to each element of the list
                    w.forEach(item -> {
                        item.setNameUser(u.getName());
                        item.setLastNameUser(u.getLastName());
                        item.setEmail(u.getEmail());
                        // Add other fields as necessary
                    });
        
                    return Flux.fromIterable(w);
                });

    }

    public WithDrawalRequestElectronicPurseResponseDTO mapRowToWDRElectronicPurseResponseDTO(Map<String, Object> row) {

        WithDrawalRequestElectronicPurseResponseDTO response = new WithDrawalRequestElectronicPurseResponseDTO();
        response.setId((Integer) row.get("id"));
        response.setIdWalletTransaction((Integer) row.get("idwallettransaction"));
        response.setDestinationCurrencyId((Integer) row.get("destinationcurrency"));
        response.setIdElectronicPurse((Integer) row.get("idelectronicpurse"));
        response.setIdRequestStates((Integer) row.get("idrequeststates"));
        response.setDestinationCurrency("Dolar");
        response.setAbbreviationCurrency("USD");
        //response.setDestinationCurrency((String) row.get("destinationcurrency"));
        response.setClosingDate((LocalDateTime) row.get("closingdate"));
        response.setImageFile((String) row.get("imagefile"));
        response.setInitialDate((LocalDateTime) row.get("initialdate"));
        response.setReferenceData((String) row.get("referencedata"));
        response.setAmount((BigDecimal) row.get("amount"));
        response.setIdUser((Integer) row.get("iduser"));
        response.setHolderName((String) row.get("holdername"));
        response.setHolderLastName((String) row.get("holderlastname"));
        response.setUsernameAccount((String) row.get("usernameaccount"));
        response.setPaidLink((String) row.get("paidlink"));
        response.setNameRequest((String) row.get("namerequest"));

        
        return response;

    }

}
