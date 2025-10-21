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
import world.inclub.wallet.api.dtos.WalletTransactionResponseDTO;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.port.IWalletTransactionPort;
import world.inclub.wallet.infraestructure.repository.IWalletTransactionRepository;

@Repository
@RequiredArgsConstructor
public class WalletTransactionRepositoryImpl implements IWalletTransactionPort {

    private final IWalletTransactionRepository iWalletTransactionRepository;
    private final DatabaseClient databaseClient;

    @Override
    public Mono<WalletTransaction> saveWalletTransaction(WalletTransaction transaction) {
        return iWalletTransactionRepository.save(transaction);
    }

    @Override
    public Flux<WalletTransactionResponseDTO> getWalletSuccessfulTransactionsResponse(int idWallet, String search) {

        String sql = "SELECT wallettransaction.*,typewallettransaction.idtransactioncategory,typewallettransaction.description "
                +
                "FROM bo_wallet.wallettransaction " +
                "JOIN bo_wallet.typewallettransaction " +
                "ON wallettransaction.idtypewallettransaction = typewallettransaction.idtypewallettransaction " +
                "WHERE issuccessfultransaction = true " +
                "AND idwallet = $1  "; //+
        //"ORDER BY initialdate DESC ;";
        if (search != null && !search.isEmpty()) {
            sql += "AND (CAST(wallettransaction.idwallettransaction AS TEXT) LIKE $2 || '%' " +
                    "OR typewallettransaction.description ILIKE '%' || $2 || '%') ";
        }

        sql += "ORDER BY initialdate DESC";
        DatabaseClient.GenericExecuteSpec query = databaseClient.sql(sql)
                .bind("$1", idWallet);

        if (search != null && !search.trim().isEmpty()) {
            query = query.bind("$2", search.trim());
        }

        return query.fetch()
                .all()
                .map(this::mapRowToWalletTransactionResponseDTO);
    }

    //list wallet recharge
    @Override
    public Flux<WalletTransactionResponseDTO> getWalletRechargeTransactionsResponse(int idWallet, Integer transferTypeIds, String search) {
        String sql = "SELECT wallettransaction.*, typewallettransaction.idtransactioncategory, typewallettransaction.description " +
                "FROM bo_wallet.wallettransaction " +
                "JOIN bo_wallet.typewallettransaction " +
                "ON wallettransaction.idtypewallettransaction = typewallettransaction.idtypewallettransaction " +
                "WHERE issuccessfultransaction = true " +
                "AND idwallet = :idWallet " +
                "AND wallettransaction.idtypewallettransaction = :transferTypeIds " ;
               // "ORDER BY initialdate DESC";
        if (search != null && !search.isEmpty()) {
            sql += "AND (CAST(wallettransaction.idwallettransaction AS TEXT) LIKE :search || '%' " +
                    "OR typewallettransaction.description ILIKE '%' || :search || '%') ";
        }

        sql += "ORDER BY initialdate DESC";
        DatabaseClient.GenericExecuteSpec query = databaseClient.sql(sql)
                .bind("idWallet", idWallet)
                .bind("transferTypeIds", transferTypeIds)
                ;
        if (search != null && !search.trim().isEmpty()) {
            query = query.bind("search", search.trim());
        }

        return query.fetch()
                .all()
                .map(this::mapRowToWalletTransactionResponseDTO);
    }

    //list wallet transactions
    @Override
    public Flux<WalletTransactionResponseDTO> getWalletTransferTransactionsResponse(int idWallet, List<Integer> transferTypeIds, String search) {
        String sql = "SELECT wallettransaction.*, typewallettransaction.idtransactioncategory, typewallettransaction.description " +
                "FROM bo_wallet.wallettransaction " +
                "JOIN bo_wallet.typewallettransaction " +
                "ON wallettransaction.idtypewallettransaction = typewallettransaction.idtypewallettransaction " +
                "WHERE issuccessfultransaction = true " +
                "AND idwallet = :idWallet " +
                "AND wallettransaction.idtypewallettransaction = ANY(ARRAY[:transferTypeIds]) ";
        // "ORDER BY initialdate DESC";
        if (search != null && !search.isEmpty()) {
            sql += "AND (CAST(wallettransaction.idwallettransaction AS TEXT) LIKE :search || '%' " +
                    "OR typewallettransaction.description ILIKE '%' || :search || '%') ";
        }

        sql += "ORDER BY initialdate DESC";

        DatabaseClient.GenericExecuteSpec query = databaseClient.sql(sql)
                .bind("idWallet", idWallet)
                .bind("transferTypeIds", transferTypeIds);

        if (search != null && !search.trim().isEmpty()) {
            query = query.bind("search", search.trim());
        }

        return query.fetch()
                .all()
                .map(this::mapRowToWalletTransactionResponseDTO);
    }
    @Override
    public Mono<WalletTransaction> getWalletTransactionById(Long idWalletTransaction) {
        return iWalletTransactionRepository.findById(idWalletTransaction);
    }

    public WalletTransactionResponseDTO mapRowToWalletTransactionResponseDTO(Map<String, Object> row) {

        WalletTransactionResponseDTO transaction = new WalletTransactionResponseDTO();
        transaction.setIdWalletTransaction(((Integer) row.get("idwallettransaction")).longValue());
        transaction.setIdWallet(((Integer) row.get("idwallet")).longValue());
        transaction.setIdTypeWalletTransaction((int) row.get("idtypewallettransaction"));
        transaction.setIdCurrency((int) row.get("idcurrency"));
        transaction.setIdExchangeRate((int) row.get("idexchangerate"));
        transaction.setInitialDate((LocalDateTime) row.get("initialdate"));
        transaction.setAmount((BigDecimal) row.get("amount"));
        transaction.setIsAvailable((Boolean) row.get("isavailable"));
        transaction.setAvailabilityDate((LocalDateTime) row.get("availabilitydate"));
        transaction.setReferenceData((String) row.get("referencedata"));
        transaction.setIsSucessfulTransaction((Boolean) row.get("issuccessfultransaction"));
        transaction.setIdTransactionCategory((int) row.get("idtransactioncategory"));
        transaction.setDescription((String) row.get("description"));

        return transaction;
    }

}
