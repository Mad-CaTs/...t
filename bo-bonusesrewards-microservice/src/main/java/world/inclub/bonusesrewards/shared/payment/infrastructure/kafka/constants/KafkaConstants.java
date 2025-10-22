package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants;

public class KafkaConstants {

    public static final String GROUP_ID = "bonus-rewards-group-999";
    public static final String KEY = "bonus-rewards-key";

    public static final class Topic {

        public static final class Wallet {
            public static final String REQUEST_REGISTER_PAYMENT_WITH_WALLET = "topic-request-registerpaymentwithwallet";
            public static final String RESPONSE_REGISTER_PAYMENT_WITH_WALLET = "topic-response-registerpaymentwithwallet";
        }

        public static final class Notification {
            public static final String REQUEST_SEND_PAYMENT_NOTIFICATION = "topic-request-send-bonus-rewards-payment-notification";
        }
    }

    public static final class ContainerFactory {
        public static final class Wallet {
            public static final String WALLET_RESPONSE_KAFKA_LISTENER_CONTAINER_FACTORY = "processWalletPaymentKafkaListenerContainerFactory";
        }

    }

}
