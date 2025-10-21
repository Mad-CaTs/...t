package world.inclub.wallet.infraestructure.kafka.constant;

public class KafkaConstants {

    public static final String GROUP_ID = "wallet-group-303";
    public static final String KEY = "walllet_123" ;

    public static final class Topic {

        public static final String CREATE_WALLET = "topic-create-wallet";
        public static final String REQUEST_USERACCOUNT = "topic-request-useraccount";
        public static final String RESPONSE_USERACCOUNT = "topic-response-useraccount";
        public static final String REQUEST_WALLET = "topic-request-wallet";
        public static final String RESPONSE_WALLET = "topic-response-wallet";
        public static final String REQUEST_REGISTER_PAYMENT_WITH_WALLET = "topic-request-registerpaymentwithwallet";
        public static final String RESPONSE_REGISTER_PAYMENT_WITH_WALLET = "topic-response-registerpaymentwithwallet";

        //Topic de operaciones de Wallet
        public static final String REQUEST_OPERATION_WALLET = "topic-request-operation-wallet";
        public static final String RESPONSE_OPERATION_WALLET = "topic-response-operation-wallet";
        public static final String ERROR_PAY = "topic-error-pay";

        private Topic() {
            throw new AssertionError("Topic class should not be instantiated.");
        }
    }

    public static final class ContainerFactory {

        public static final String CREATE_WALLET_KAFKA_LISTENER_CONTAINER_FACTORY = "createWalletKafkaListenerContainerFactory";
        public static final String REGISTER_PAYMENT_WITH_WALLET_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY = "registerPaymenWithWalletRequestKafkaListenerContainerFactory";
        public static final String USER_ACCOUNT_KAFKA_LISTENER_CONTAINER_FACTORY = "userAccountKafkaListenerContainerFactory";
        public static final String WALLET_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY = "walletRequestKafkaListenerContainerFactory";

        //WalletTransaction-Admin
        public static final String WALLETTRANSACTION_KAFKA_LISTENER_CONTAINER_FACTORY = "walletTransactionKafkaListenerContainerFactory";
        public static final String ADMINRESQUEST_KAFKA_LISTENER_CONTAINER_FACTORY= "adminRequestKafkaListenerContainerFactory";

        public static final String INTEGER_KAFKA_LISTENER_CONTAINER_FACTORY = "integerKafkaListenerContainerFactory";

        private ContainerFactory() {
            throw new AssertionError("ContainerFactory class should not be instantiated.");
        }
    }

}
