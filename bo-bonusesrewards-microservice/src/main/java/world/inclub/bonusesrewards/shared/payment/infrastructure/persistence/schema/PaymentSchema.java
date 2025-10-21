package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema;

import world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants;

import javax.xml.crypto.Data;

public class PaymentSchema {
    public static final String SCHEMA = DataBaseConstants.BONUS_REWARDS_SCHEMA;

    public static class Table{
        public static final String PAYMENTS = "payments";
        public static final String PAYMENT_VOUCHERS = "payment_vouchers";
        public static final String PAYMENT_REJECTION = "payment_rejection";
        public static final String PAYMENT_REJECTION_REASONS = "payment_rejection_reasons";
    }

    public static class View{
        public static final String PAYMENTS_LIST_VIEW  = "payments_list_view";
    }
}
