package world.inclub.wallet.infraestructure.persistence;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;


import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestAccountBankResponseDTO;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestElectronicPurseResponseDTO;
import world.inclub.wallet.domain.entity.WithDrawalRequestAccountBank;
import world.inclub.wallet.domain.port.IWithDrawalRequestAccountBankPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.repository.IWithDrawalRequestAccountBankRepository;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.BankResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CountryResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CurrencyResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;

@Repository
@RequiredArgsConstructor
public class WithDrawalRequestAccountBankRepositoryImpl implements IWithDrawalRequestAccountBankPort {

    private final IWithDrawalRequestAccountBankRepository iRepository;
    private final DatabaseClient databaseClient;
    private final KafkaRequestReplyAccountService serviceKafka;
    private final IAdminPanelService iAdminPanelService;

    @Override
    public Mono<WithDrawalRequestAccountBank> saveWDRAccountBank(WithDrawalRequestAccountBank request) {

        return iRepository.save(request);
    }

    @Override
    public Flux<WithDrawalRequestAccountBankResponseDTO> getWDRAccountBankByIdUser(Integer idUser) {

        String sql = "SELECT " +
                "    request.*, " +
                "    walletTrans.initialdate, " +
                "    walletTrans.availabilitydate, " +
                "    walletTrans.referencedata, " +
                "    walletTrans.amount, " +
                "    account.idtypeaccountbank, " +
                "    account.idbank, " +
                "    account.iduser, " +
                "    account.holder, " +
                "    account.accountnumber, " +
                "    account.taxpayernumber, " +
                "    account.companyname, " +
                "    account.fiscaladdress, " +
                "    account.cci, " +
                "    account.status, " +
                "    account.bankaddress, " +
                "    account.swift, " +
                "    account.iban, " +
                "    requestState.name as nameRequest, " +
                "    typeTrans.description AS descriptionTransaction " +
                "FROM " +
                "    bo_wallet.withdrawalrequestaccountbank request " +
                "INNER JOIN " +
                "    bo_wallet.wallettransaction walletTrans " +
                "    ON request.idwallettransaction = walletTrans.idwallettransaction " +
                "INNER JOIN " +
                "    bo_wallet.accountbank account " +
                "    ON request.idaccountbank = account.idaccountbank " +
                "INNER JOIN " +
                "    bo_wallet.requeststates requestState " +
                "    ON requestState.idrequeststates = request.idrequeststates " +
                "INNER JOIN " +
                "    bo_wallet.typewallettransaction typeTrans " +
                "    ON walletTrans.idtypewallettransaction = typeTrans.idtypewallettransaction " +
                "WHERE " +
                "    account.iduser = $1 " +
                "ORDER BY " +
                "    walletTrans.initialdate DESC;";

        Flux<WithDrawalRequestAccountBankResponseDTO> response = response = databaseClient.sql(sql)
                .bind("$1", idUser)
                .fetch()
                .all()
                .map(this::mapRowToWDRAccountBankResponseDTO);
        
        //Mono<UserAccountDTO> user = serviceKafka.getUserAccountById(idUser);
        //Mono<List<CountryResponse>> countrys= iAdminPanelService.getCountrys();
        //Mono<List<CurrencyResponse>> currency= iAdminPanelService.getCurrencies();
        //Mono<List<BankResponse>> banks= iAdminPanelService.getBanks();
        

        Mono<UserAccountDTO> user = serviceKafka.getUserAccountById(idUser);

                return response.collectList().zipWith(user).flatMapMany(tuple -> {
                    List<WithDrawalRequestAccountBankResponseDTO> w = tuple.getT1();
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

    public WithDrawalRequestAccountBankResponseDTO mapRowToWDRAccountBankResponseDTO(Map<String, Object> row) {

        WithDrawalRequestAccountBankResponseDTO response = new WithDrawalRequestAccountBankResponseDTO();
        response.setId((Integer) row.get("id"));
        response.setIdWalletTransaction((Integer) row.get("idwallettransaction"));
        response.setDestinationCurrencyId((Integer) row.get("destinationcurrency"));
        response.setIdAccountBank((Integer) row.get("idaccountbank"));
        response.setIdRequestStates((Integer) row.get("idrequeststates"));
        response.setDestinationCurrency("Dolar");
        response.setAbbreviationCurrency("USD");
        //response.setDestinationCurrency((String) row.get("destinationcurrency"));
        response.setClosingDate((LocalDateTime) row.get("closingdate"));
        response.setImageFile((String) row.get("imagefile"));
       // 
        response.setIdTypeAccountBank((Integer) row.get("idtypeaccountbank"));
        response.setHolder((String) row.get("holder"));
        response.setAccountNumber((String) row.get("accountnumber"));    
        response.setTaxpayerNumber((String) row.get("taxpayernumber"));
        response.setCompanyName((String) row.get("companyname"));
        response.setFiscalAddress((String) row.get("fiscaladdress"));
        response.setCci((String) row.get("cci"));
        response.setStatus((Boolean) row.get("status"));
        response.setBankAddress((String) row.get("bankaddress"));
        response.setSwift((String) row.get("swift"));
        response.setIban((String) row.get("iban"));
        response.setIdBank((Integer) row.get("idbank"));

        response.setInitialDate((LocalDateTime) row.get("initialdate"));
        response.setReferenceData((String) row.get("referencedata"));
        response.setAmount((BigDecimal) row.get("amount"));
        response.setIdUser((Integer) row.get("iduser"));
        response.setNameRequest((String) row.get("namerequest"));

        return response;
    }

}
