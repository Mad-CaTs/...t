package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema;

import world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants;

public class BonusSchema {

    public static final String SCHEMA = DataBaseConstants.BONUS_REWARDS_SCHEMA;

    public static class Table {
        public static final String BONUS_REQUIREMENT_TABLE = "bonus_requirements";
        public static final String CLASSIFICATION_TABLE = "classifications";
    }

    public static class View {
        public static final String CLASSIFICATION_WITH_MEMBER_VIEW = "classifications_with_member_view";
    }

}