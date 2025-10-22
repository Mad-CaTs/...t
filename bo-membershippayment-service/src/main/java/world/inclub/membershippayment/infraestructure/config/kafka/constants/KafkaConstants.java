package world.inclub.membershippayment.infraestructure.config.kafka.constants;

public class KafkaConstants {

    public static final String GROUP_ID = "membership-group-690" ;
    public static final String KEY = "membership-key" ;

    public static final class Topic {

        public static final String CREATE_AFFILIATE = "topic-affiliate";
        public static final String TOPIC_UPDATE_MEMBERSHIP_MULTI_CODE = "topic-update-membership-multi-code";

        //Canales de Comunicacion con panel Admin
        public static final String TOPIC_SUSCRIPTION = "topic-test-suscription";
        public static final String TOPIC_PAYMENT = "topic-payment";
        public static final String TOPIC_PAYMENTVOUCHER = "topic-paymentvoucher";
        public static final String TOPIC_MEMBERSHIP = "topic-membership";

        //Para eliminar se maneja bajo un estado "666"
        public static final String TOPIC_SCHEDULE_DELETE = "topic-schedule-delete";

        public static final String REQUEST_SCHEDULE_UPDATE = "topic-request-schedule-update";
        public static final String RESPONSE_SCHEDULE_UPDATE = "topic-response-schedule-update";


        public static final String CREATE_WALLET = "topic-create-wallet";
        public static final String REQUEST_USERACCOUNT = "topic-request-useraccount";
        public static final String RESPONSE_USERACCOUNT = "topic-response-useraccount";
        public static final String REQUEST_WALLET = "topic-request-wallet";
        public static final String RESPONSE_WALLET = "topic-response-wallet";
        public static final String REQUEST_REGISTER_PAYMENT_WITH_WALLET = "topic-request-registerpaymentwithwallet";
        public static final String RESPONSE_REGISTER_PAYMENT_WITH_WALLET = "topic-response-registerpaymentwithwallet";

        //Topicos de Migration a Membership
        public static final String REQUEST_MIGRATION_SUSCRIPTION = "topic-request-suscription";
        public static final String RESPONSE_MIGRATION_SUSCRIPTION = "topic-response-suscription";
        public static final String REQUEST_MIGRATION_PAYMENT  = "topic-request-payment";
        public static final String RESPONSE_MIGRATION_PAYMENT  = "topic-response-payment";
        public static final String REQUEST_MIGRATION_PAYMENTVOUCHER = "topic-request-paymentvoucher";
        public static final String RESPONSE_MIGRATION_PAYMENTVOUCHER = "topic-response-paymentvoucher";

        public static final String REQUEST_TOKEN_PAYMENT = "topic-request-token";
        public static final String RESPONSE_TOKEN_PAYMENT = "topic-response-token";


        //Topicos De Commissions
        //holi uwu
        public static final String REQUEST_MEMBERSHIP_TO_TREE = "topic-request-commission-membership-to-tree";
        public static final String REQUEST_TREE_TO_COMMISSION = "topic-request-commission-tree-to-commission";

        //Topic Delete Elementos
        public static final String DELETE_PAYMENT_VOUCHER = "topic-delete-paymentvoucher";
        public static final String DELETE_PAYMENT_VOUCHER_BY_ID = "delete-payment-voucher-by-id";

        private Topic() {
            throw new AssertionError("Topic class should not be instantiated.");
        }
    }

    public static final class ContainerFactory {

        public static final String CREATE_WALLET_KAFKA_LISTENER_CONTAINER_FACTORY = "createWalletKafkaListenerContainerFactory";
        public static final String REGISTER_PAYMENT_WITH_WALLET_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY = "registerPaymentWalletResponseKafkaListenerContainerFactory";
        public static final String USER_ACCOUNT_KAFKA_LISTENER_CONTAINER_FACTORY = "userAccountKafkaListenerContainerFactory";
        public static final String WALLET_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY = "walletRequestKafkaListenerContainerFactory";
        public static final String WALLET_RESPONSE_KAFKA_LISTENER_CONTAINER_FACTORY = "walletResponseKafkaListenerContainerFactory";


        public static final String SUSCRIPTION_KAFKA_LISTENER_CONTAINER_FACTORY = "suscriptionMembershipKafkaListenerContainerFactory";
        public static final String PAYMENT_KAFKA_LISTENER_CONTAINER_FACTORY = "paymentMembershipKafkaListenerContainerFactory";
        public static final String PAYMENTVOUCHER_KAFKA_LISTENER_CONTAINER_FACTORY =  "paymentVoucherKafkaListenerContainerFactory";

        public static final String UPDATE_SCHEDULE_KAFKA_LISTENER_CONTAINER_FACTORY = "updateScheduleResponseKafkaListenerContainerFactory";

        public static final String TOKEN_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY = "tokenPaymentRequestKafkaListenerContainerFactory";

        public static final String INTEGER_KAFKA_LISTENER_CONTAINER_FACTORY = "integerKafkaListenerContainerFactory";

        private ContainerFactory() {
            throw new AssertionError("ContainerFactory class should not be instantiated.");
        }
    }

}
