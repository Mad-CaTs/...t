package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants;

public class KafkaConstants {

    public static final String GROUP_ID = "ticket-group-222";
    public static final String KEY = "ticket-key";

    public static final class Topic {

        public static final class Wallet {
            public static final String REQUEST_REGISTER_PAYMENT_WITH_WALLET = "topic-request-registerpaymentwithwallet";
            public static final String RESPONSE_REGISTER_PAYMENT_WITH_WALLET = "topic-response-registerpaymentwithwallet";
        }

        public static final class Notification {
            public static final String REQUEST_SEND_NOTIFICATION = "topic-request-send-ticket-notification";
        }

    }

}
