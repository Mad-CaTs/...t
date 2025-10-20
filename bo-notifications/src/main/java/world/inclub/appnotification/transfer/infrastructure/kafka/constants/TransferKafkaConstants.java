package world.inclub.appnotification.transfer.infrastructure.kafka.constants;

public class TransferKafkaConstants {
    public static class Topic {
        public static final String Notification = "transfer-notification";
        public static final String REQUEST_SEND_NOTIFICATION = "transfer.notification.request.send";
        public static final String REQUEST_SEND_NOTIFICATION_LEGACY = "transfer-request-email";
    }
}
