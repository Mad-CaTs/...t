package world.inclub.transfer.liquidation.infraestructure.kafka.constant;

public class KafkaConstans {

    public static final String GROUP_ID = "transfer-group-100";

    public static final class Topic {

        public static final String CREATE_TRANSFER = "topic-create-transfer";
        public static final String REQUEST_TRANSFER = "topic-request-transfer";
        public static final String RESPONSE_TRANSFER = "topic-response-transfer";

        private Topic() {
            throw new AssertionError("Topic class should not be instantiated.");
        }
    }

    public static final class ContainerFactory {

        public static final String CREATE_TRANSFER_KAFKA_LISTENER_CONTAINER_FACTORY = "createTransferKafkaListenerContainerFactory";

        private ContainerFactory() {
            throw new AssertionError("ContainerFactory class should not be instantiated.");
        }
    }

}
