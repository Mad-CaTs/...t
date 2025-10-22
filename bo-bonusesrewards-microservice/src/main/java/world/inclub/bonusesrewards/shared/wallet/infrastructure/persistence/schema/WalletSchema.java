package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.schema;

import world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants;

public class WalletSchema {

    public static final String SCHEMA = DataBaseConstants.WALLET_SCHEMA;

    public static class Table {
        public static final String WALLET_TABLE = "wallet";
        public static final String WALLET_TRANSACTION_TABLE = "wallettransaction";
    }

}