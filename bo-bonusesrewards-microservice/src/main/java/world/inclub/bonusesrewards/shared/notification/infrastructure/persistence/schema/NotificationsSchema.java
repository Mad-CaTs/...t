package world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.schema;

import world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants;

public class NotificationsSchema {

    public static final String SCHEMA = DataBaseConstants.BONUS_REWARDS_SCHEMA;

    public static class Table {
        public static final String NOTIFICATION_TYPES_TABLE = "notification_types";
        public static final String NOTIFICATIONS_TABLE = "notifications";
    }

}